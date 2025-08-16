import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",

  dbCredentials: {
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST!,
    password: process.env.POSTGRES_PASSWORD!,
    port: parseInt(process.env.POSTGRES_PORT!),
    user: process.env.POSTGRES_USER!,
    ssl: false,
  },
});
