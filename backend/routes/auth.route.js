import express from "express";
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
  googleAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authRateLimit } from "../middleware/rateLimiters.js";
import { verifyOriginOrReferer } from "../middleware/originCheck.middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.post("/signup", verifyOriginOrReferer, authRateLimit, signup);

router.post("/login", verifyOriginOrReferer, authRateLimit, login);

router.post("/logout", verifyOriginOrReferer, protectRoute, logout);

router.post(
  "/refresh-token",
  verifyOriginOrReferer,
  protectRoute,
  refreshToken,
);

router.get("/profile", protectRoute, getProfile);

router.post("/google", verifyOriginOrReferer, googleAuth);

export default router;
