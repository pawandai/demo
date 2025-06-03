import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../services/apiClient";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post("/auth/login", credentials);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success("Login successful!");
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || "Login failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });

          // Include language in the request if not already included
          if (!userData.language) {
            const language = localStorage.getItem("language") || "sv";
            userData.language = language;
          }

          // Fix the URL - ensure it doesn't have a double "/api" prefix
          const response = await apiClient.post("/api/auth/register", userData);

          if (response.data?.token) {
            localStorage.setItem("token", response.data.token);
            apiClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.token}`;

            set({
              isAuthenticated: true,
              user: response.data.user,
              isLoading: false,
            });

            return { success: true };
          } else {
            set({
              isLoading: false,
              error: new Error("No token received"),
            });
            return { error: new Error("No token received") };
          }
        } catch (error) {
          console.error("Registration error:", error);
          set({ isLoading: false, error });
          return { error };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success("Logged out successfully");
      },

      updateProfile: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.put("/auth/profile", userData);
          const { user } = response.data;

          set({
            user,
            isLoading: false,
          });

          toast.success("Profile updated successfully!");
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.error || "Update failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
