import { create } from "zustand";
import axios from "../lib/axios";

const useChatStore = create((set, get) => ({
  chats: [],
  loading: false,
  error: null,

  // Fetch all chats
  fetchChats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/chats");
      console.log("Fetched Chats:", res.data);
      set({ chats: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch chats",
        loading: false,
      });
    }
  },

  createChat: async (newChat) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/chats", newChat);
      set((state) => ({ chats: [res.data, ...state.chats] }));
    } catch (err) {
      console.error("Create chat Error:", err);
      set({ error: "Failed to create chat" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useChatStore;
