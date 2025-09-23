import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendVerificationEmail } from './emailService.js';
import { analyzeMealDescription } from './aiService.js';
import db from '../db/index.js';
import { meals, nutrients } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import conf from '../conf/index.js';

// Redis connection
const connection = new IORedis({
    host: conf.redisHost,
    port: conf.redisPort,
    password: conf.redisPassword,
    username: 'default',
    maxRetriesPerRequest: null,
});

// Email queue
export const emailQueue = new Queue('email-queue', {
    connection,
    defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
    },
});

// AI Analysis queue
export const aiQueue = new Queue('ai-analysis-queue', {
    connection,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 200,
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    },
});

// Email worker
const emailWorker = new Worker('email-queue', async (job) => {
    const { type, data } = job.data;

    switch (type) {
        case 'verification':
            await sendVerificationEmail(data.email, data.verificationToken);
            break;
        default:
            throw new Error(`Unknown email type: ${type}`);
    }
}, { connection });

// AI Analysis worker
const aiWorker = new Worker('ai-analysis-queue', async (job) => {
    const { type, data } = job.data;

    switch (type) {
        case 'meal-analysis':
            await processMealAnalysis(data);
            break;
        default:
            throw new Error(`Unknown AI job type: ${type}`);
    }
}, {
    connection,
    concurrency: 2 // Process 2 AI jobs concurrently
});

// Process meal analysis job
async function processMealAnalysis({ mealId, description, mealName, mealTime }) {
    try {
        console.log(`Starting AI analysis for meal ${mealId}`);

        // Update meal status to processing
        await db.update(meals)
            .set({ aiAnalysisStatus: 'processing' })
            .where(eq(meals.id, mealId));

        // Perform AI analysis
        const analysisResult = await analyzeMealDescription(description, mealName, mealTime);

        if (analysisResult.success) {
            // Store analysis result and update meal
            await db.update(meals)
                .set({
                    aiAnalysisStatus: 'completed',
                    aiAnalysisResult: JSON.stringify(analysisResult.data)
                })
                .where(eq(meals.id, mealId));

            // Create or update nutrition record if AI provided nutrition data
            const nutrition = analysisResult.data.nutrition;
            if (nutrition && (nutrition.calories > 0 || nutrition.protein > 0 || nutrition.carbohydrates > 0 || nutrition.fats > 0)) {
                // Check if nutrition record already exists
                const existingNutrition = await db.select()
                    .from(nutrients)
                    .where(eq(nutrients.mealId, mealId))
                    .limit(1);

                if (existingNutrition.length > 0) {
                    // Update existing nutrition record
                    await db.update(nutrients)
                        .set({
                            calories: nutrition.calories,
                            protein: nutrition.protein,
                            carbohydrates: nutrition.carbohydrates,
                            fats: nutrition.fats
                        })
                        .where(eq(nutrients.mealId, mealId));
                } else {
                    // Create new nutrition record
                    await db.insert(nutrients)
                        .values({
                            mealId,
                            calories: nutrition.calories,
                            protein: nutrition.protein,
                            carbohydrates: nutrition.carbohydrates,
                            fats: nutrition.fats
                        });
                }
            }

            console.log(`AI analysis completed for meal ${mealId}`);
        } else {
            // Analysis failed
            await db.update(meals)
                .set({
                    aiAnalysisStatus: 'failed',
                    aiAnalysisResult: JSON.stringify({ error: analysisResult.error })
                })
                .where(eq(meals.id, mealId));

            console.error(`AI analysis failed for meal ${mealId}:`, analysisResult.error);
        }

    } catch (error) {
        console.error(`Error processing meal analysis for meal ${mealId}:`, error);

        // Update meal status to failed
        await db.update(meals)
            .set({
                aiAnalysisStatus: 'failed',
                aiAnalysisResult: JSON.stringify({ error: error.message })
            })
            .where(eq(meals.id, mealId));

        throw error; // Re-throw to trigger job retry
    }
}

// Worker event handlers
emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Email job ${job.id} failed:`, err);
});

aiWorker.on('completed', (job) => {
    console.log(`AI analysis job ${job.id} completed`);
});

aiWorker.on('failed', (job, err) => {
    console.error(`AI analysis job ${job.id} failed:`, err);
});

export { emailWorker, aiWorker };