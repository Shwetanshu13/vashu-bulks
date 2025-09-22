// packages/db/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import conf from "./src/conf/index.js";

dotenv.config(); // Adjust path if needed

export default defineConfig({
    schema: "./src/db/schema.js",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: conf.dbUrl,
    },
});
