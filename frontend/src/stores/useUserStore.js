//file created to manage user state
import { create } from "zustand";
import toast from "react-hot-toast";
import apiClient from "../lib/axios";
import { code } from "framer-motion/client";

const useUserStore = create((set, get) => ({
  user: null,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    try {
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      }
      const response = await apiClient.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });
      set({ user: response.data });
      console.log("Response data user: ", response.data);
      return {
        success: true,
        message: response.data.message || "Signup successful!",
      };
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed.",
      };
    }
  },

  login: async ({ email, password }) => {
    console.log("Attempting login with email:", email, password);
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      console.log("USER HAS LOGGED IN ", response.data.user);
      set({ user: response.data.user, checkingAuth: false });
      return {
        success: true,
        message: response.data.message || "Login successful!",
      };
      // toast.success(response.data.message || "Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      // toast.error(error.response.data.message);
      return {
        success: false,
        message: error.response.data.message || "Login failed.",
      };
    }
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  },

  // In useUserStore.js
  initializeAuth: async () => {
    try {
      const response = await apiClient.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      // If 401, try to refresh token
      if (error.response?.status === 401) {
        try {
          await apiClient.post("/auth/refresh");
          const newResponse = await apiClient.get("/auth/profile");
          set({ user: newResponse.data, checkingAuth: false });
          return;
        } catch (refreshError) {
          console.log("Refresh failed");
        }
      }
      set({ user: null, checkingAuth: false });
    }
  },

  googleAuth: async (authorizationCode) => {
    try {
      const response = await apiClient.post("/auth/google", {
        code: authorizationCode,
      });
      set({ user: response.data.user });
      toast.success("Google authentication successful!");
    } catch (error) {
      console.error("Google Auth error:", error);

      toast.error(
        error.response?.data?.message || "Google authentication failed."
      );
    }
  },

  setUser: (user) => set({ user }),
}));

export default useUserStore;
