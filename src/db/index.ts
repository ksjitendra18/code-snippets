import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./relations";
import { Pool } from "pg";

const globalForPg = globalThis as unknown as { __pgPool?: Pool };

const pool =
  globalForPg.__pgPool ??
  new Pool({
    host: process.env.POSTGRES_HOST!,
    port: parseInt(process.env.POSTGRES_PORT!),
    database: process.env.POSTGRES_DB!,
    user: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.__pgPool = pool;
}

export const db = drizzle({
  client: pool,
  relations,
});
