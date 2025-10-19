import { create } from "zustand";
import axios from "../lib/axios";

const useAiStore = create((set, get) => ({
  response: null,
  loading: false,
  error: null,
  responseCount: 0,

  // Fetch AI response with a prompt
  fetchResponse: async (prompt) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/ai", { prompt });
      console.log("Fetched response:", res.data);
      set({
        response: res.data.response,
        loading: false,
        responseCount: get().responseCount + 1, // <-- FIX HERE
      });
      return res.data.response;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch response",
        loading: false,
      });
      return null;
    }
  },
  reset: () =>
    set({
      response: null,
      loading: false,
      error: null,
      responseCount: 0,
    }),
}));

export default useAiStore;
