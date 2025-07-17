import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { relations } from "./relations";

export const db = drizzle({
  connection: {
    url: process.env.DB_URL!,
    authToken: process.env.DB_TOKEN!,
  },
  relations,
});
