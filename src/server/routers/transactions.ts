import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";
import { Transaction } from "@/types";

export const transactionsRouter = createTRPCRouter({
  // Create a new transaction
  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        amount: z.number(),
        transactionType: z.enum(["WITHDRAWAL", "DEPOSIT", "PAYMENT", "INCOME"]),
        description: z.string(),
        transactionDate: z.string(),
        transactionCode: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post("/transactions", input, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Transaction;
    }),

  // Update a transaction
  update: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        data: z.object({
          amount: z.number().optional(),
          transactionType: z
            .enum(["WITHDRAWAL", "DEPOSIT", "PAYMENT", "INCOME"])
            .optional(),
          description: z.string().optional(),
          transactionDate: z.string().optional(),
          transactionCode: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.put(
        `/transactions/${input.transactionId}`,
        input.data,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Transaction;
    }),

  // Delete a transaction
  delete: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(
        `/transactions/${input.transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as { message: string };
    }),
});

export default transactionsRouter;
