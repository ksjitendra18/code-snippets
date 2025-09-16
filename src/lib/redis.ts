import { Redis } from "ioredis";

export const redis = new Redis({
  host: process.env.VALKEY_HOST || "localhost",
  port: parseInt(process.env.VALKEY_PORT || "6379"),
  password: process.env.VALKEY_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});
