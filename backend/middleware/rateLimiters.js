import rateLimit from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

function createRateLimit(options) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true,
    handler: (req, res, next, context) => {
      return res.status(options.statusCode || 429).json({
        message: options.message || "Too many requests. Please try again later.",
      });
    },
    ...options,
  });
}

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProduction ? 10 : 100,
  message: "Too many auth attempts. Please try again later.",
});

export const aiRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000,
  limit: isProduction ? 30 : 500,
  message: "Too many AI requests. Please slow down.",
});

export const messageRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000,
  limit: isProduction ? 60 : 1000,
  message: "Too many message requests. Please slow down.",
});
