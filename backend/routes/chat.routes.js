import express from "express";
import {
  getUserChats,
  createChat,
  getChatById,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);

router.post("/new", createChat);
router.get("/:chatId", getChatById);

export default router;
