import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { Account, TransactionsResponse } from "@/types";

// API functions
const getOrganizationAccount = async (
  organizationId: string
): Promise<Account> => {
  const response = await apiClient.get(
    `/accounts/organization/${organizationId}`
  );
  return response.data;
};

const getAccountTransactions = async (
  accountId: string,
  page: number = 1,
  limit: number = 10,
  transactionType?: "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME",
  minAmount?: number,
  maxAmount?: number,
  startDate?: string,
  endDate?: string
): Promise<TransactionsResponse> => {
  const params: {
    page: number;
    limit: number;
    transactionType?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
  } = { page, limit };

  if (transactionType) params.transactionType = transactionType;
  if (minAmount !== undefined) params.minAmount = minAmount;
  if (maxAmount !== undefined) params.maxAmount = maxAmount;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await apiClient.get(`/transactions/account/${accountId}`, {
    params,
  });
  return response.data;
};

// Hooks
export const useOrganizationAccount = (organizationId: string) => {
  return useQuery({
    queryKey: ["accounts", "organization", organizationId],
    queryFn: () => getOrganizationAccount(organizationId),
    enabled: !!organizationId,
  });
};

export const useAccountTransactions = (
  accountId: string,
  page: number = 1,
  limit: number = 10,
  transactionType?: "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME",
  minAmount?: number,
  maxAmount?: number,
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: [
      "transactions",
      "account",
      accountId,
      page,
      limit,
      transactionType,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    ],
    queryFn: () =>
      getAccountTransactions(
        accountId,
        page,
        limit,
        transactionType,
        minAmount,
        maxAmount,
        startDate,
        endDate
      ),
    enabled: !!accountId,
  });
};

export const useMyAccounts = () => {
  return useQuery({
    queryKey: ["accounts", "my"],
    queryFn: (): Promise<Account[]> => Promise.resolve([]),
    staleTime: Infinity, // Don't refetch mock data
  });
};
