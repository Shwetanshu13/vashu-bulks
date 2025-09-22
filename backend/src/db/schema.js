import { pgTable, bigserial, text, timestamp, integer, bigint } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    emailVerified: integer("email_verified").default(0), // 0 = false, 1 = true
    verificationToken: text("verification_token"),
    tokenExpiry: timestamp("token_expiry", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Meals table
export const meals = pgTable("meals", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: bigint("user_id", { mode: "number" })
        .references(() => users.id),
    mealName: text("meal_name").notNull(),
    mealTime: timestamp("meal_time", { withTimezone: true }).notNull(),
    description: text("description"), // User's description of the meal
    aiAnalysisStatus: text("ai_analysis_status").default("pending"), // pending, processing, completed, failed
    aiAnalysisResult: text("ai_analysis_result"), // JSON string of AI analysis
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Nutrients table
export const nutrients = pgTable("nutrients", {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    mealId: bigint("meal_id", { mode: "number" })
        .references(() => meals.id),
    calories: integer("calories").notNull(),
    protein: integer("protein").notNull(),
    carbohydrates: integer("carbohydrates").notNull(),
    fats: integer("fats").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
