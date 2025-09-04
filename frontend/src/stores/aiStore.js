import { create } from "zustand";
import axios from "../lib/axios";

const useAiStore = create((set, get) => ({
  response: null,
  loading: false,
  error: null,

  // Fetch AI response with a prompt
  fetchResponse: async (prompt) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/ai", { prompt });
      console.log("Fetched response:", res.data);
      set({ response: res.data.response, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch response",
        loading: false,
      });
    }
  },
}));

export default useAiStore;
