import { create } from "zustand";
import axios from "../lib/axios";

const useMessageStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  // Fetch all messages
  fetchmessages: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/messages");
      console.log("Fetched messages:", res.data);
      set({ messages: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch messages",
        loading: false,
      });
    }
  },

  createMessage: async (newMessage) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/messages", newMessage);
      set((state) => ({ messages: [res.data, ...state.messages] }));
    } catch (err) {
      console.error("Create message Error:", err);
      set({ error: "Failed to create message" });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMessageStore;
