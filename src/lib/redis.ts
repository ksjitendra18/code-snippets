import { Redis } from "ioredis";

console.log("Connecting to Redis...", process.env.VALKEY_PORT);

export const redis = new Redis({
  host: process.env.VALKEY_HOST || "localhost",
  port: parseInt(process.env.VALKEY_PORT || "6380"),
  password:
    process.env.VALKEY_PASSWORD || "77aa01cc-930a-4fce-96ee-aebd6cd2c261",
  maxRetriesPerRequest: null,
});
