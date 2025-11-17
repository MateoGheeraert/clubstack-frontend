import apiClient from "@/lib/api-client";
import { Account, Transaction, TransactionsResponse } from "@/types";

/**
 * Fetch all accounts for a specific organization
 */
export async function getOrganizationAccounts(
  organizationId: string
): Promise<Account[]> {
  const response = await apiClient.get(
    `/accounts/organization/${organizationId}`
  );
  return response.data;
}

/**
 * Fetch a single account by ID
 */
export async function getAccount(accountId: string): Promise<Account> {
  const response = await apiClient.get(`/accounts/${accountId}`);
  return response.data;
}

/**
 * Create a new account for an organization
 */
export async function createAccount(data: {
  organizationId: string;
  accountName: string;
  type: string;
  balance?: number;
}): Promise<Account> {
  const response = await apiClient.post("/accounts", data);
  return response.data;
}

/**
 * Update an existing account
 */
export async function updateAccount(
  accountId: string,
  data: Partial<Account>
): Promise<Account> {
  const response = await apiClient.put(`/accounts/${accountId}`, data);
  return response.data;
}

/**
 * Delete an account
 */
export async function deleteAccount(accountId: string): Promise<void> {
  await apiClient.delete(`/accounts/${accountId}`);
}

/**
 * Fetch transactions for a specific account
 */
export async function getAccountTransactions(
  accountId: string,
  page: number = 1,
  limit: number = 10,
  transactionType?: "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME",
  minAmount?: number,
  maxAmount?: number,
  startDate?: string,
  endDate?: string
): Promise<TransactionsResponse> {
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
}

/**
 * Create a new transaction
 */
export async function createTransaction(data: {
  accountId: string;
  amount: number;
  transactionType: "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME";
  description: string;
  transactionDate: string;
  transactionCode: string;
}): Promise<Transaction> {
  const response = await apiClient.post("/transactions", data);
  return response.data;
}
