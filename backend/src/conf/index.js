import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    dbUrl: process.env.DB_URL || 'postgresql://localhost:5432/yeschef',
    saltRounds: 10,
    // Email configuration
    mailtrapHost: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
    mailtrapPort: process.env.MAILTRAP_PORT || 2525,
    mailtrapUser: process.env.MAILTRAP_USER,
    mailtrapPass: process.env.MAILTRAP_PASS,
    emailFrom: process.env.EMAIL_FROM || 'noreply@yeschef.com',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    // Redis configuration
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || 6379,
    redisPassword: process.env.REDIS_PASSWORD,
    // Gemini AI configuration
    geminiApiKey: process.env.GEMINI_API_KEY,
}