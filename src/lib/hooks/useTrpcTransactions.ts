"use client";

import { trpc } from "@/lib/trpc-provider";

/**
 * tRPC-based hooks for transactions
 */

export const useCreateTransaction = () => {
  const utils = trpc.useUtils();
  return trpc.transactions.create.useMutation({
    onSuccess: () => {
      // Invalidate accounts and transactions queries
      utils.accounts.invalidate();
      utils.transactions.invalidate();
    },
  });
};

export const useUpdateTransaction = () => {
  const utils = trpc.useUtils();
  return trpc.transactions.update.useMutation({
    onSuccess: () => {
      utils.accounts.invalidate();
      utils.transactions.invalidate();
    },
  });
};

export const useDeleteTransaction = () => {
  const utils = trpc.useUtils();
  return trpc.transactions.delete.useMutation({
    onSuccess: () => {
      utils.accounts.invalidate();
      utils.transactions.invalidate();
    },
  });
};
