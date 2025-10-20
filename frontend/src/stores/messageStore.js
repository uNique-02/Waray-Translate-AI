import { create } from "zustand";
import axios from "../lib/axios";

const useMessageStore = create((set, get) => ({
  messages: [],
  response: null,
  loading: false,
  error: null,
  chatId: null,

  // ✅ Fetch all messages by chat
  fetchMessages: async (chatId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/messages/${chatId}`);
      // console.log(" STORE FETCHED MESSAGES ", res.data);

      set({ messages: res.data, chatId, loading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({
        error: error.response?.data?.message || "Failed to load messages",
        loading: false,
      });
    }
  },

  // ✅ Create a new message
  sendMessage: async ({ userId, chatId = null, query, response }) => {
    // console.log("Store: ", userId, chatId, query, response);
    try {
      set({ loading: true, error: null });

      // console.log(`
      //   PARAMETERS PASSED:
      //   \n userId: ${userId}
      //   \n chatId: ${chatId}
      //   \n query: ${query}
      //   \n response: ${response}
      //   `);

      const res = await axios.post(`/messages/new`, {
        userId,
        chatId,
        query,
        response,
      });

      console.log(
        "STORE AFTER SENDING MESSAGE, RESPONSE FROM SERVER: ",
        res.data
      );

      const { chat, message } = res.data;

      // console.log("UPDATED CHAT: ", chat);

      // If chat was newly created, update chatId
      if (!chatId && chat?._id) {
        set({ chatId: chat._id });
      }

      // Append the new message
      set((state) => ({
        messages: [...state.messages, message],
        loading: false,
      }));

      // set({ messages: res.data, chatId, loading: false });

      // console.log("RETURNING CHAT AND MESSAGES");

      return { chat, message };
    } catch (error) {
      console.error("Error sending message:", error);
      set({
        error: error.response?.data?.message || "Failed to send message",
        loading: false,
      });
      return null;
    }
  },

  // 🗑️ Delete a message
  deleteMessage: async (messageId) => {
    try {
      await axios.delete(`/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      console.error("Error deleting message:", error);
      set({ error: "Failed to delete message" });
    }
  },

  // ♻️ Reset store (e.g., when switching chat)
  // resetMessages: () => set({ messages: [], chatId: null, error: null }),

  // 🔄 Full reset — clears everything in the store
  resetAll: () =>
    set({
      messages: [],
      response: null,
      loading: false,
      error: null,
      chatId: null,
    }),
}));

export default useMessageStore;
