import { Redis, RedisOptions } from "ioredis";
import "dotenv/config";


export const redisConnectionOptions: RedisOptions = {
  host: process.env.VALKEY_HOST,
  port: parseInt(process.env.VALKEY_PORT!),
  password: process.env.VALKEY_PASSWORD,
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConnectionOptions);
