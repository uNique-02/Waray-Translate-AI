// tokenService.js
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d"; // Used for JWT, separate TTL for Redis

/**
 * Generates and stores tokens in Redis.
 * @param {Object} payload - JWT payload, e.g., { userId: '123' }
 * @returns {{ accessToken: string, refreshToken: string }}
 */
async function generateTokens(user) {
  // console.log("User ID before signing token:", user._id);

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );

  // Store refresh token in Redis with TTL matching expiry (7 days = 604800 seconds)
  const redisKey = `refreshToken:${user._id}`;
  await redis.set(redisKey, refreshToken, "EX", 60 * 60 * 24 * 7);

  return { accessToken, refreshToken };
}

export const saveAccessToken = async (userId, accessToken) => {
  const redisKey = `accessToken:${userId}`;
  await redis.set(redisKey, accessToken, "EX", 60 * 15); // 15 minutes
};

export const getAccessToken = async (userId) => {
  const redisKey = `accessToken:${userId}`;
  const accessToken = await redis.get(redisKey);
  return accessToken;
};

export const saveRefreshToken = async (userId, refreshToken) => {
  const redisKey = `refreshToken:${userId}`;
  await redis.set(redisKey, refreshToken, "EX", 60 * 60 * 24 * 7); // 7 days
};

export const getRefreshToken = async (userId) => {
  const redisKey = `refreshToken:${userId}`;
  const refreshToken = await redis.get(redisKey);
  return refreshToken;
};

export default generateTokens;
