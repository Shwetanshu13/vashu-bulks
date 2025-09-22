import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import conf from './conf/index.js';
import authRoutes from './routes/auth.js';
import mealRoutes from './routes/meals.js';
import nutritionRoutes from './routes/nutrition.js';
import aiRoutes from './routes/ai.js';
import './lib/queue.js'; // Initialize the queue worker

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

const PORT = conf.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});