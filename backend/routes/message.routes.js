import express from "express";
import {
  sendMessage,
  getMessagesByChat,
  deleteMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { messageRateLimit } from "../middleware/rateLimiters.js";
import { verifyOriginOrReferer } from "../middleware/originCheck.middleware.js";

const router = express.Router();

router.post(
  "/new",
  verifyOriginOrReferer,
  protectRoute,
  messageRateLimit,
  sendMessage,
);
router.get("/:chatId", protectRoute, getMessagesByChat);
router.delete("/:messageId", verifyOriginOrReferer, protectRoute, deleteMessage);

export default router;
