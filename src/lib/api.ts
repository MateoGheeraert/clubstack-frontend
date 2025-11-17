import createClient from "openapi-fetch";
import type { paths } from "@/types/openapi";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Create type-safe API client
export const api = createClient<paths>({
  baseUrl: API_BASE_URL,
});

// Add auth middleware to inject Bearer token
api.use({
  onRequest({ request }) {
    // Only access localStorage in browser environment
    if (typeof window !== "undefined") {
      const token = Cookies.get("token") || localStorage.getItem("token");
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return request;
  },
});

export default api;
