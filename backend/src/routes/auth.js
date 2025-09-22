import express from 'express';
import { signup, login, verifyEmail, resendVerification } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/verify-email
router.post('/verify-email', verifyEmail);

// POST /api/auth/resend-verification
router.post('/resend-verification', resendVerification);

export default router;