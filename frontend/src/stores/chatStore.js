import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
// import { Link, useNavigate } from "react-router-dom";

const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      currentChat: null,
      loading: false,
      error: null,
      // navigate: useNavigate(),

      setCurrentChat: (chat) => set({ currentChat: chat }),

      // Fetch all chats for current user
      fetchChats: async (userId) => {
        try {
          set({ loading: true, error: null });
          const res = await axios.get(`/chats?userId=${userId}`);
          set({ chats: res.data, loading: false });
        } catch (error) {
          console.error("Error fetching chats:", error);
          set({
            error: error.response?.data?.message || "Failed to load chats",
            loading: false,
          });
        }
      },

      // Create a new chat
      createChat: async (userId, firstMessage = "New chat") => {
        try {
          set({ loading: true, error: null });
          const res = await axios.post("/chats/create", {
            userId,
            message: firstMessage,
          });
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

      deleteChat: async (chatId) => {
        try {
          // console.log("Chat store is called to delete chat with ID: ", chatId);
          const res = await axios.delete(`/chats/${chatId}`);
          console.log(res.data);
          set((state) => ({
            chats: state.chats.filter(
              (chat) => chat.id !== chatId && chat._id !== chatId,
            ),
          }));

          // If the deleted chat is currently open, unset it
          if (
            get().currentChat?._id === chatId ||
            get().currentChat?.id === chatId
          ) {
            set({ currentChat: null });
          }
        } catch (err) {
          console.error("Error deleting chat:", err);
        }
      },

      fetchChatById: async (chatId) => {
        if (!chatId) {
          set({ error: "Chat ID is required" });
          return null;
        }

        try {
          set({ loading: true, error: null });

          console.log("Fetching chat with ID:", chatId);
          const res = await axios.get(`/chats/${chatId}`);

          // console.log("Fetched chat data in fetchByID:", res.data);

          set({ currentChat: res.data, loading: false });
          return res.data;
        } catch (error) {
          console.error("Error fetching chat by ID:", error);
          set({
            error: error.response?.data?.message || "Failed to fetch chat",
            loading: false,
          });
          return null;
        }
      },

      resetChats: () => set({ chats: [], currentChat: null, error: null }),
    }),
    {
      name: "chat-storage", // 🔑 key in localStorage
      partialize: (state) => ({
        chats: state.chats,
        currentChat: state.currentChat,
      }),
    },
  ),
);

export default useChatStore;
