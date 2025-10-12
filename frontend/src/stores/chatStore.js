import { create } from "zustand";
import axios from "../lib/axios";

const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  loading: false,
  error: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),

  // ✅ Fetch all chats for current user
  fetchChats: async (userId) => {
    try {
      console.log(userId);
      set({ loading: true, error: null });
      const res = await axios.get(`/chats?userId=${userId}`);
      console.log("STORE USER CHATS ", res.data);
      set({ chats: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching chats:", error);
      set({
        error: error.response?.data?.message || "Failed to load chats",
        loading: false,
      });
    }
  },

  // ✅ Create new chat for user
  createChat: async (userId, firstMessage = "New chat") => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post("/chats/create", {
        userId,
        message: firstMessage,
      });
      // Or directly call the controller route that uses createChatForUser
      const newChat = res.data;
      set((state) => ({
        chats: [...state.chats, newChat],
        currentChat: newChat,
        loading: false,
      }));
      return newChat;
    } catch (error) {
      console.error("Error creating chat:", error);
      set({
        error: error.response?.data?.message || "Failed to create chat",
        loading: false,
      });
    }
  },

  // ✅ Get a chat by ID
  fetchChatById: async (chatId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/chats/${chatId}`);
      set({ currentChat: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching chat:", error);
      set({
        error: error.response?.data?.message || "Chat not found",
        loading: false,
      });
    }
  },

  // ✅ Add a message to an existing chat
  addMessageToChat: async (chatId, content, role) => {
    try {
      const res = await axios.post(`/api/chats/add-message`, {
        chatId,
        content,
        role,
      });
      const newMessage = res.data;

      set((state) => ({
        currentChat: {
          ...state.currentChat,
          messages: [...(state.currentChat?.messages || []), newMessage],
        },
        chats: state.chats.map((chat) =>
          chat._id === chatId
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        ),
      }));
      return newMessage;
    } catch (error) {
      console.error("Error adding message:", error);
      set({ error: "Failed to add message" });
    }
  },

  // 🗑️ Optional: Delete a chat
  deleteChat: async (chatId) => {
    try {
      await axios.delete(`/api/chats/${chatId}`);
      set((state) => ({
        chats: state.chats.filter((c) => c._id !== chatId),
        currentChat:
          state.currentChat && state.currentChat._id === chatId
            ? null
            : state.currentChat,
      }));
    } catch (error) {
      console.error("Error deleting chat:", error);
      set({ error: "Failed to delete chat" });
    }
  },

  // ♻️ Reset chat store (useful when user logs out)
  resetChats: () => set({ chats: [], currentChat: null, error: null }),
}));

export default useChatStore;
