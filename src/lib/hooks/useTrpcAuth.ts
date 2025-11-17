"use client";

import { trpc } from "@/lib/trpc-provider";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

/**
 * tRPC-based hooks for authentication
 */

export const useLogin = () => {
  const router = useRouter();
  
  return trpc.auth.login.useMutation({
    onSuccess: (data: { token: string; refreshToken: string; user: { id: string; email: string; role: "USER" | "ADMIN" } }) => {
      // Store tokens
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push("/dashboard");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  
  return trpc.auth.register.useMutation({
    onSuccess: (data: { token: string; refreshToken: string; user: { id: string; email: string; role: "USER" | "ADMIN" } }) => {
      // Store tokens
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to dashboard
      router.push("/dashboard");
    },
  });
};

export const useCurrentUser = () => {
  const token = typeof window !== "undefined" 
    ? Cookies.get("token") || localStorage.getItem("token")
    : null;

  return trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
  });
};

export const useRefreshToken = () => {
  return trpc.auth.refresh.useMutation({
    onSuccess: (data: { token: string }) => {
      Cookies.set("token", data.token, { expires: 7 });
      localStorage.setItem("token", data.token);
    },
  });
};
