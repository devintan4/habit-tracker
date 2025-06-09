import { create } from "zustand";
import api from "../api/client";

interface AuthState {
  token: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const savedToken = localStorage.getItem("token");
  const savedUsername = localStorage.getItem("username");

  return {
    token: savedToken,
    username: savedUsername,

    login: async (usernameInput, password) => {
      try {
        const res = await api.post<{ token: string }>("/auth/login", {
          username: usernameInput,
          password,
        });
        const tok = res.data.token;
        localStorage.setItem("token", tok);
        localStorage.setItem("username", usernameInput);
        set({ token: tok, username: usernameInput });
        return true;
      } catch (err) {
        console.error("login error:", err);
        return false;
      }
    },

    register: async (username, password) => {
      try {
        await api.post("/auth/register", { username, password });
        return true;
      } catch {
        return false;
      }
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      set({ token: null, username: null });
    },

    isAuthenticated: () => !!get().token,
  };
});