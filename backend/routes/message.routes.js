import express from "express";
import {
  sendMessage,
  getMessagesByChat,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/new", sendMessage);
router.get("/:chatId", getMessagesByChat);
router.delete("/:messageId", deleteMessage);

export default router;
