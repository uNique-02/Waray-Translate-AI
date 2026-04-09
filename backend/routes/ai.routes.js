import express from "express";
import { getResponse } from "../controllers/openrouter.controller.js";
import { aiRateLimit } from "../middleware/rateLimiters.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { verifyOriginOrReferer } from "../middleware/originCheck.middleware.js";

const router = express.Router();

router.post("/", verifyOriginOrReferer, protectRoute, aiRateLimit, getResponse);

export default router;
