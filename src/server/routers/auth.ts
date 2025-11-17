import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const response = await apiClient.post("/auth/login", input);
        return response.data as {
          token: string;
          refreshToken: string;
          user: {
            id: string;
            email: string;
            role: "USER" | "ADMIN";
          };
        };
      } catch (error: unknown) {
        const axiosError = error as { response?: { data?: unknown }; message?: string };
        console.error("Login error:", axiosError.response?.data || axiosError.message);
        throw error;
      }
    }),

  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const response = await apiClient.post("/auth/register", input);
      return response.data as {
        token: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          role: "USER" | "ADMIN";
        };
      };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const response = await apiClient.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    return response.data as {
      id: string;
      email: string;
      role: "USER" | "ADMIN";
    };
  }),

  refresh: publicProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await apiClient.post("/auth/refresh", input);
      return response.data as {
        token: string;
      };
    }),
});

export default authRouter;
