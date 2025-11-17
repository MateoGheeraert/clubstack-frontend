import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { apiClient } from "@/lib/api-client";
import { Account, TransactionsResponse } from "@/types";

export const accountsRouter = createTRPCRouter({
  // Get all accounts for an organization
  getByOrganization: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(
        `/accounts/organization/${input.organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Account[];
    }),

  // Get a single account by ID
  getById: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await apiClient.get(`/accounts/${input.accountId}`, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Account;
    }),

  // Create a new account
  create: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        accountName: z.string(),
        type: z.string(),
        balance: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.post("/accounts", input, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as Account;
    }),

  // Update an account
  update: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        data: z.object({
          accountName: z.string().optional(),
          type: z.string().optional(),
          balance: z.number().optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.put(
        `/accounts/${input.accountId}`,
        input.data,
        {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as Account;
    }),

  // Delete an account
  delete: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await apiClient.delete(`/accounts/${input.accountId}`, {
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return response.data as { message: string };
    }),

  // Get transactions for an account
  getTransactions: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
        transactionType: z
          .enum(["WITHDRAWAL", "DEPOSIT", "PAYMENT", "INCOME"])
          .optional(),
        minAmount: z.number().optional(),
        maxAmount: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { accountId, ...params } = input;
      const response = await apiClient.get(
        `/transactions/account/${accountId}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        }
      );
      return response.data as TransactionsResponse;
    }),
});

export default accountsRouter;
