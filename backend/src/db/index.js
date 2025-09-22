// Make sure to install the 'pg' package 
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import conf from "../conf/index.js";

const pool = new Pool({
    connectionString: conf.dbUrl,
});
const db = drizzle({ client: pool });

export default db;
