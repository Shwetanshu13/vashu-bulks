import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import conf from '../conf/index.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, conf.jwtSecret);
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Check if user exists and is verified
        const userResult = await db.select()
            .from(users)
            .where(eq(users.id, decoded.userId))
            .limit(1);

        if (userResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = userResult[0];

        if (user.emailVerified === 0) {
            return res.status(403).json({
                success: false,
                message: 'Email not verified'
            });
        }

        // Add user to request object
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            try {
                const decoded = jwt.verify(token, conf.jwtSecret);
                const userResult = await db.select()
                    .from(users)
                    .where(eq(users.id, decoded.userId))
                    .limit(1);

                if (userResult.length > 0 && userResult[0].emailVerified === 1) {
                    req.user = {
                        id: userResult[0].id,
                        email: userResult[0].email,
                        name: userResult[0].name
                    };
                }
            } catch (error) {
                // Token is invalid, but we don't throw error for optional auth
                console.log('Optional auth token invalid:', error.message);
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next(); // Continue even if there's an error
    }
};