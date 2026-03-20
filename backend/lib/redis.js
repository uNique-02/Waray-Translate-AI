import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
  tls: {}, // 🔥 REQUIRED for Upstash
  maxRetriesPerRequest: 1, // optional (prevents spam errors)
});
