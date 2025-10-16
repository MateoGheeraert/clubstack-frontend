"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganizationAccount, useAccountTransactions } from "@/lib/hooks";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

export default function AccountsPage() {
  const { selectedOrganizationId } = useOrganizationContext();
  const [transactionType, setTransactionType] = useState<
    "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME" | undefined
  >();
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { data: account, isLoading: accountLoading } = useOrganizationAccount(
    selectedOrganizationId || ""
  );
  const { data: transactionsResponse, isLoading: transactionsLoading } =
    useAccountTransactions(
      account?.id || "",
      page,
      10,
      transactionType,
      minAmount,
      maxAmount
    );

  const totalBalance = account?.balance || 0;
  const isLoading = accountLoading || transactionsLoading;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Accounts & Transactions
          </h1>
          <p className='text-muted-foreground'>
            Manage financial accounts and view transaction history
          </p>
        </div>
        <div className='flex space-x-2'>
          <Button variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Add Transaction
          </Button>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            New Account
          </Button>
        </div>
      </div>

      {/* Account Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold'>
                ${totalBalance.toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Active Accounts
            </CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>{account ? 1 : 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Income</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold text-green-600'>
                +$
                {(
                  (transactionsResponse?.summary?.deposits || 0) +
                  (transactionsResponse?.summary?.income || 0)
                ).toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Expenses</CardTitle>
            <TrendingDown className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold text-red-600'>
                -$
                {(
                  (transactionsResponse?.summary?.withdrawals || 0) +
                  (transactionsResponse?.summary?.payments || 0)
                ).toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
          <CardDescription>
            Your organization&apos;s financial accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-4 border rounded'
                >
                  <div>
                    <Skeleton className='h-5 w-32 mb-1' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className='h-6 w-20' />
                </div>
              ))}
            </div>
          ) : account ? (
            <div className='space-y-3'>
              <div className='flex items-center justify-between p-4 border rounded hover:bg-muted/50'>
                <div className='flex items-center space-x-4'>
                  <Wallet className='h-8 w-8 text-muted-foreground' />
                  <div>
                    <h3 className='font-semibold'>{account.accountName}</h3>
                    <p className='text-sm text-muted-foreground'>
                      {account.type} • Created{" "}
                      {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-lg font-semibold'>
                    ${(account?.balance || 0).toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      (account?.balance || 0) >= 0 ? "default" : "destructive"
                    }
                  >
                    {(account?.balance || 0) >= 0 ? "Positive" : "Negative"}
                  </Badge>
                </div>
              </div>
            </div>
          ) : !selectedOrganizationId ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Wallet className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold'>Select an Organization</h3>
              <p className='text-muted-foreground mb-4'>
                Please select an organization in the top bar to view its
                accounts.
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <Wallet className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold'>No account found</h3>
              <p className='text-muted-foreground mb-4'>
                This organization doesn&apos;t have an account yet.
              </p>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Create Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Transaction Filters
          </CardTitle>
          <CardDescription>
            Filter transactions by type, amount range, and date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <Label htmlFor='transaction-type'>Transaction Type</Label>
              <Select
                value={transactionType || "all"}
                onValueChange={(value) =>
                  setTransactionType(
                    value === "all"
                      ? undefined
                      : (value as
                          | "WITHDRAWAL"
                          | "DEPOSIT"
                          | "PAYMENT"
                          | "INCOME")
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='All types' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All types</SelectItem>
                  <SelectItem value='DEPOSIT'>Deposit</SelectItem>
                  <SelectItem value='WITHDRAWAL'>Withdrawal</SelectItem>
                  <SelectItem value='PAYMENT'>Payment</SelectItem>
                  <SelectItem value='INCOME'>Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='min-amount'>Min Amount</Label>
              <Input
                id='min-amount'
                type='number'
                placeholder='0'
                value={minAmount || ""}
                onChange={(e) =>
                  setMinAmount(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor='max-amount'>Max Amount</Label>
              <Input
                id='max-amount'
                type='number'
                placeholder='1000'
                value={maxAmount || ""}
                onChange={(e) =>
                  setMaxAmount(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
              />
            </div>
            <div className='flex items-end'>
              <Button
                variant='outline'
                onClick={() => {
                  setTransactionType(undefined);
                  setMinAmount(undefined);
                  setMaxAmount(undefined);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {transactionsResponse?.summary && (
              <>
                Total: ${transactionsResponse.summary.totalAmount?.toFixed(2)} |
                Deposits: ${transactionsResponse.summary.deposits?.toFixed(2)} |
                Withdrawals: $
                {transactionsResponse.summary.withdrawals?.toFixed(2)} |
                Payments: ${transactionsResponse.summary.payments?.toFixed(2)} |
                Income: ${transactionsResponse.summary.income?.toFixed(2)}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className='h-4 w-20' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-16 ml-auto' />
                    </TableCell>
                  </TableRow>
                ))
              ) : transactionsResponse?.transactions?.length ? (
                transactionsResponse.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(
                        new Date(transaction.transactionDate),
                        "MMM dd, yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        {transaction.transactionType === "DEPOSIT" ||
                        transaction.transactionType === "INCOME" ? (
                          <TrendingUp className='h-4 w-4 text-green-600' />
                        ) : (
                          <TrendingDown className='h-4 w-4 text-red-600' />
                        )}
                        <Badge
                          variant={
                            transaction.transactionType === "DEPOSIT" ||
                            transaction.transactionType === "INCOME"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {transaction.transactionType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className='font-mono text-sm'>
                      {transaction.transactionCode}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        transaction.transactionType === "DEPOSIT" ||
                        transaction.transactionType === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.transactionType === "DEPOSIT" ||
                      transaction.transactionType === "INCOME"
                        ? "+"
                        : "-"}
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-8 text-muted-foreground'
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {transactionsResponse?.pagination &&
            transactionsResponse.pagination.totalPages > 1 && (
              <div className='flex items-center justify-between mt-4'>
                <p className='text-sm text-muted-foreground'>
                  Page {transactionsResponse.pagination.page} of{" "}
                  {transactionsResponse.pagination.totalPages}(
                  {transactionsResponse.pagination.total} total transactions)
                </p>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={transactionsResponse.pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      transactionsResponse.pagination.page >=
                      transactionsResponse.pagination.totalPages
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
