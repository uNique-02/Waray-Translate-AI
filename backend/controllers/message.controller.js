import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js"; // assuming you have a Chat model
import { createChat } from "./chat.controller.js";

// 🟩 Create a new message
export const sendMessage = async (req, res) => {
  try {
    const params = req.body;
    const { userId, chatId, query, response } = req.body;
    let chat;
    console.log("PARAMETERS: ", userId, query);
    if (!chatId) {
      // ✅ Create chat using function from chatController
      chat = await createChat(userId, query);
      console.log("CHAT: ", chat);
    } else {
      chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ message: "Chat not found" });
    }

    // ✅ Create message
    let message;

    try {
      console.log("Creating new message with data:", {
        chatId: chat._id,
        sender: userId,
        query,
        response,
      });

      message = await Message.create({
        chat: chat._id,
        sender: userId,
        query,
        response,
      });

      console.log("Message successfully created:", message);
    } catch (error) {
      console.error("Error creating message:", error);
      throw error; // rethrow to outer catch
    }

    console.log("MESSAGE ", message);

    // Safeguard if message failed to create
    if (!message) {
      console.warn("No message created; skipping push to chat");
      return res.status(400).json({ message: "Failed to create message" });
    }

    chat.messages.push(message._id);
    await chat.save();

    res.status(201).json({ chat, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟨 Get all messages in a specific chat
export const getMessagesByChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    console.log("Chat ID from messages retrieval: ", chatId);

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

    const message = await Message.findByIdAndDelete(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
