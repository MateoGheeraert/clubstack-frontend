import Cookies from "js-cookie";
import { User } from "@/types/auth";

export const tokenUtils = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return Cookies.get("token") || localStorage.getItem("token");
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    Cookies.set("token", token, { expires: 7 }); // 7 days
    localStorage.setItem("token", token);
  },

  removeToken: (): void => {
    if (typeof window === "undefined") return;
    Cookies.remove("token");
    localStorage.removeItem("token");
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
  },

  setRefreshToken: (refreshToken: string): void => {
    if (typeof window === "undefined") return;
    Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 days
    localStorage.setItem("refreshToken", refreshToken);
  },

  removeRefreshToken: (): void => {
    if (typeof window === "undefined") return;
    Cookies.remove("refreshToken");
    localStorage.removeItem("refreshToken");
  },

  isAuthenticated: (): boolean => {
    return !!tokenUtils.getToken();
  },
};

export const userUtils = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear corrupted user data
      localStorage.removeItem("user");
      return null;
    }
  },

  setUser: (user: User): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },

  removeUser: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("user");
  },
};

export const logout = (): void => {
  tokenUtils.removeToken();
  tokenUtils.removeRefreshToken();
  userUtils.removeUser();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
