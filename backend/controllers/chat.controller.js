import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Create a new chat session
export const createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    const newChat = await Chat.create({ title, user: userId });
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all chats for the authenticated user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ user: userId }).populate("messages");
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
