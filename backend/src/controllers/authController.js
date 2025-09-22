import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import { emailQueue } from '../lib/queue.js';
import conf from '../conf/index.js';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, conf.saltRounds);

        // Generate verification token
        const verificationToken = jwt.sign({ email }, conf.jwtSecret, { expiresIn: '24h' });
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create user
        const newUser = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            emailVerified: 0,
            verificationToken,
            tokenExpiry
        }).returning();

        // Send verification email asynchronously
        await emailQueue.add('verification-email', {
            type: 'verification',
            data: {
                email,
                verificationToken
            }
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully. Please check your email to verify your account.',
            user: {
                id: newUser[0].id,
                name: newUser[0].name,
                email: newUser[0].email,
                emailVerified: false
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (userResult.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = userResult[0];

        // Check if email is verified
        if (user.emailVerified === 0) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            conf.jwtSecret,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Verification token is required'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, conf.jwtSecret);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        const { email } = decoded;

        // Find user and check token
        const userResult = await db.select().from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (userResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = userResult[0];

        // Check if token matches and hasn't expired
        if (user.verificationToken !== token) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification token'
            });
        }

        if (user.tokenExpiry && new Date() > user.tokenExpiry) {
            return res.status(400).json({
                success: false,
                message: 'Verification token has expired'
            });
        }

        // Update user as verified
        await db.update(users)
            .set({
                emailVerified: 1,
                verificationToken: null,
                tokenExpiry: null
            })
            .where(eq(users.id, user.id));

        res.json({
            success: true,
            message: 'Email verified successfully. You can now log in.'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Find user
        const userResult = await db.select().from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (userResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = userResult[0];

        if (user.emailVerified === 1) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = jwt.sign({ email }, conf.jwtSecret, { expiresIn: '24h' });
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Update user with new token
        await db.update(users)
            .set({
                verificationToken,
                tokenExpiry
            })
            .where(eq(users.id, user.id));

        // Send verification email
        await emailQueue.add('verification-email', {
            type: 'verification',
            data: {
                email,
                verificationToken
            }
        });

        res.json({
            success: true,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};