import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

import dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";

export const createChat = async (userId, message) => {
  try {
    const title = await generateTitleFromMessage(message);

    console.log("GENERATED TITLE: ", title);

    // Find the user and push the chat reference
    const user = await User.findById(userId);
    if (!user) {
      console.log("USer not found");
      throw new Error("User not found");
    }

    const chat = await Chat.create({ user: userId, title: title });

    user.chats.push(chat._id);
    await user.save();
    return chat;
  } catch (error) {
    console.error("Error creating chat:", error);
    return null;
  }
};

// Create a new chat session
// export const createChat = async (req, res) => {
//   try {
//     const { title, messages = "" } = req.body;
//     const userId = req.user._id;

//     if (title == "New Chat" || !title || title.trim() === "") {
//       title = await generateTitleFromMessage(
//         messages.length > 0 ? messages[0].content : "New Chat"
//       );
//     }

//     const newChat = await Chat.create({
//       title,
//       user: userId,
//       messages: [messages] || [],
//     });
//     res.status(201).json(newChat);
//   } catch (error) {
//     console.error("Error creating chat:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
// Get all chats for the authenticated user
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.query;
    const chats = await Chat.find({ user: userId }).populate("messages");
    console.log("USER CHATS", chats);
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addMessageToChat = async (req, res) => {
  try {
    const { chatId, content, role } = req.body;
    const userId = req.user._id;
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const newMessage = await Message.create({ chat: chatId, content, role });
    chat.messages.push(newMessage._id);
    await chat.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error adding new message to chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user._id;
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function generateTitleFromMessage(message) {
  dotenv.config();
  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    console.error("Missing Hugging Face API token");
    return "Untitled Chat";
  }

  const client = new InferenceClient(HF_TOKEN);

  try {
    const response = await client.chatCompletion({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `
You are a helpful assistant that generates short, meaningful titles from user messages.

Rules:
- Always produce a title of 2–4 words.
- No punctuation, quotes, emojis, or additional commentary.
- The title should describe the message's topic or intent.
- Return ONLY the title text.

Examples:
User: "Translate this to Waray: Good morning"
Title: "Waray Translation Request"

User: "What’s the weather today in Tacloban?"
Title: "Tacloban Weather Inquiry"

User: "Can you help me debug my code?"
Title: "Code Debugging Help"

User: "Tell me a funny story about a dog"
Title: "Funny Dog Story"
Now generate a 2–4 word title for the next message.
      `,
        },
        { role: "user", content: "Explain subnetting in simple terms" },
        {
          role: "assistant",
          content: `Subnetting Explanation`,
        },
        { role: "user", content: "How to improve my English writing?" },
        {
          role: "assistant",
          content: `English Writing Tips`,
        },
        {
          role: "user",
          content: `Generate a title for this message: "${message}"`,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    console.log("HF RESPONSE:", response);

    console.log("HF RESPONSE MESSAGE:", response.choices[0].message);

    console.log("HF RESPONSE CONTENT:", response.choices[0].message.content);

    const title =
      response?.choices?.[0]?.message?.content ||
      response?.choices?.[0]?.content ||
      "Untitled Chat";

    return title.trim();
  } catch (err) {
    console.error("Error generating title:", err);
    return "Untitled Chat";
  }
}
