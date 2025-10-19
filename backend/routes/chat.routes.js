import express from "express";
import {
  getUserChats,
  createChat,
  getChatById,
  deleteChat,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getUserChats);

router.post("/new", createChat);
router.get("/:chatId", protectRoute, getChatById);
router.delete("/:chatId", protectRoute, deleteChat);

export default router;
