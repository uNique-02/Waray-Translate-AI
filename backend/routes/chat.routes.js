import express from "express";
import {
  getUserChats,
  createChat,
  getChatById,
  deleteChat,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { verifyOriginOrReferer } from "../middleware/originCheck.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);

router.post("/new", verifyOriginOrReferer, protectRoute, async (req, res) => {
  try {
    const userId = req.user?._id;
    const message = req.body?.message || "New chat";

    const chat = await createChat(userId, message);
    if (!chat) {
      return res.status(500).json({ message: "Failed to create chat" });
    }

    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/:chatId", protectRoute, getChatById);
router.delete("/:chatId", verifyOriginOrReferer, protectRoute, deleteChat);

export default router;
