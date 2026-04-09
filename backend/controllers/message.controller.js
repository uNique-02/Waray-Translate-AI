import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js"; // assuming you have a Chat model
import mongoose from "mongoose";
import { createChat } from "./chat.controller.js";

// 🟩 Create a new message
export const sendMessage = async (req, res) => {
  try {
    const { userId, chatId, query, response } = req.body;
    const trimmedUserId = typeof userId === "string" ? userId.trim() : "";
    const trimmedChatId = typeof chatId === "string" ? chatId.trim() : "";
    const trimmedQuery = typeof query === "string" ? query.trim() : "";
    const trimmedResponse = typeof response === "string" ? response.trim() : "";

    if (!trimmedUserId || !mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (trimmedChatId && !mongoose.Types.ObjectId.isValid(trimmedChatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    if (!trimmedQuery) {
      return res.status(400).json({ message: "Message text is required" });
    }

    if (trimmedQuery.length > 4000 || trimmedResponse.length > 4000) {
      return res.status(400).json({ message: "Message is too long" });
    }

    const authenticatedUserId = req.user?._id ? String(req.user._id) : null;
    if (!authenticatedUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (trimmedUserId && authenticatedUserId !== trimmedUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let chat;
    // console.log("PARAMETERS: ", userId, query);
    if (!trimmedChatId) {
      // ✅ Create chat using function from chatController
      chat = await createChat(authenticatedUserId, trimmedQuery);
      // console.log("CHAT: ", chat);
    } else {
      chat = await Chat.findOne({
        _id: trimmedChatId,
        user: authenticatedUserId,
      });
      if (!chat) return res.status(404).json({ message: "Chat not found" });
    }

    // console.log("CHAT FOUND: ", chat);

    // ✅ Create message
    let message;

    try {
      // console.log("Creating new message with data:", {
      //   chatId: chat?._id || null,
      //   sender: userId,
      //   query,
      //   response,
      // });

      message = await Message.create({
        chat: chat?._id || null,
        sender: authenticatedUserId,
        query: trimmedQuery,
        response: trimmedResponse,
      });

      // console.log("Message successfully created:", message);
    } catch (error) {
      console.error("Error creating message:", error);
      throw error; // rethrow to outer catch
    }

    // console.log("MESSAGE ", message);

    // Safeguard if message failed to create
    if (!message) {
      return res.status(400).json({ message: "Failed to create message" });
    }

    chat.messages.push(message);
    await chat.save();

    // console.log("UPDATED CHAT AFTER NEW MESSAGE", chat);

    res.status(201).json({ chat, message });
  } catch (error) {
    console.error("[message.controller] sendMessage failed", error);
    res.status(500).json({ message: error.message });
  }
};

// 🟨 Get all messages in a specific chat
export const getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ _id: chatId, user: req.user?._id });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email") // optional
      .sort({ createdAt: 1 }); // oldest to newest

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🟥 Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const chat = await Chat.findOne({ _id: message.chat, user: req.user?._id });
    if (!chat) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Message.deleteOne({ _id: messageId });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
