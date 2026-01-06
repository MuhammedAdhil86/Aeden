import { create } from "zustand";
import { axiosInstanceLogin } from "@/service/axiosInstance";
import { login as loginAPI } from "@/service/api";

export const useAuthStore = create((set) => ({
  user: null,
  company: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Initialize Zustand from localStorage (browser only)
  initialize: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      const company = localStorage.getItem("company");
      const token = localStorage.getItem("token");

      set({
        user: user ? JSON.parse(user) : null,
        company: company ? JSON.parse(company) : null,
        token: token || null,
        isAuthenticated: !!token,
      });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstanceLogin.post(loginAPI, credentials);
      const { user, company, token } = response.data.data;

      set({
        user,
        company,
        token,
        isAuthenticated: true,
        loading: false,
      });

      // ✅ Persist to localStorage in browser
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("company", JSON.stringify(company));
        localStorage.setItem("token", token);
      }

      return response.data;
    } catch (error) {
      set({ error: "Login failed", loading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      company: null,
      token: null,
      isAuthenticated: false,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("company");
      localStorage.removeItem("token");
    }
  },
}));
