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

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", protectRoute, refreshToken);

router.get("/profile", protectRoute, getProfile);

router.post("/google", googleAuth);

export default router;
