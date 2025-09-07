import { Redis } from "ioredis";

export const redis = new Redis({
  host: process.env.VALKEY_HOST || "localhost",
  port: parseInt(process.env.VALKEY_PORT || "6379"),
  password: process.env.VALKEY_PASSWORD || undefined,
  maxRetriesPerRequest: null,
});

async function test() {
  try {
    console.log("Redis test started...");
    const result = await redis.set("hello", "world");
    console.log("Redis set success:", result);
    const value = await redis.get("hello");
    console.log("Redis get success:", value);
  } catch (error) {
    console.error("Redis error:", error);
  }
}

test();
