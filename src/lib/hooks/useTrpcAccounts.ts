"use client";

import { trpc } from "@/lib/trpc-provider";

/**
 * tRPC-based hooks for accounts
 */

export const useOrganizationAccounts = (organizationId: string) => {
  return trpc.accounts.getByOrganization.useQuery(
    { organizationId },
    {
      enabled: !!organizationId,
    }
  );
};

export const useAccount = (accountId: string) => {
  return trpc.accounts.getById.useQuery(
    { accountId },
    {
      enabled: !!accountId,
    }
  );
};

export const useAccountTransactions = (
  accountId: string,
  options?: {
    page?: number;
    limit?: number;
    transactionType?: "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME";
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
  }
) => {
  return trpc.accounts.getTransactions.useQuery(
    {
      accountId,
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
      transactionType: options?.transactionType,
      minAmount: options?.minAmount,
      maxAmount: options?.maxAmount,
      startDate: options?.startDate,
      endDate: options?.endDate,
    },
    {
      enabled: !!accountId,
    }
  );
};

export const useCreateAccount = () => {
  const utils = trpc.useUtils();
  return trpc.accounts.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch accounts queries
      utils.accounts.invalidate();
    },
  });
};

export const useUpdateAccount = () => {
  const utils = trpc.useUtils();
  return trpc.accounts.update.useMutation({
    onSuccess: () => {
      utils.accounts.invalidate();
    },
  });
};

export const useDeleteAccount = () => {
  const utils = trpc.useUtils();
  return trpc.accounts.delete.useMutation({
    onSuccess: () => {
      utils.accounts.invalidate();
    },
  });
};
