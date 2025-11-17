"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Filter,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import {
  useAccount,
  useAccountTransactions,
} from "@/lib/hooks/useTrpcAccounts";
import { useCreateTransaction } from "@/lib/hooks/useTrpcTransactions";
import type { Transaction } from "@/types";

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;

  const [transactionType, setTransactionType] = useState<
    "WITHDRAWAL" | "DEPOSIT" | "PAYMENT" | "INCOME" | undefined
  >();
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    transactionType: "DEPOSIT" as
      | "WITHDRAWAL"
      | "DEPOSIT"
      | "PAYMENT"
      | "INCOME",
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
    transactionCode: "",
  });

  // Fetch account details using tRPC
  const { data: account, isLoading: accountLoading } = useAccount(accountId);

  // Fetch transactions using tRPC
  const { data: transactionsResponse, isLoading: transactionsLoading } =
    useAccountTransactions(accountId, {
      page,
      limit: 10,
      transactionType,
      minAmount,
      maxAmount,
    });

  // Create transaction mutation using tRPC
  const createTransactionMutation = useCreateTransaction();

  const handleCreateTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return;

    createTransactionMutation.mutate({
      accountId,
      amount: parseFloat(newTransaction.amount),
      transactionType: newTransaction.transactionType,
      description: newTransaction.description,
      transactionDate: new Date(newTransaction.transactionDate).toISOString(),
      transactionCode: newTransaction.transactionCode,
    });

    // Reset form and close dialog
    setIsDialogOpen(false);
    setNewTransaction({
      amount: "",
      transactionType: "DEPOSIT",
      description: "",
      transactionDate: new Date().toISOString().split("T")[0],
      transactionCode: "",
    });
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => router.push("/accounts")}
          >
            <ArrowLeft className='h-5 w-5' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {accountLoading ? (
                <Skeleton className='h-9 w-64' />
              ) : (
                account?.accountName
              )}
            </h1>
            <p className='text-muted-foreground'>
              {accountLoading ? (
                <Skeleton className='h-5 w-48' />
              ) : (
                `${account?.type} • ${account?.organization?.name}`
              )}
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Create a new transaction for this account
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='0.00'
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='transaction-type'>Transaction Type</Label>
                <Select
                  value={newTransaction.transactionType}
                  onValueChange={(value) =>
                    setNewTransaction({
                      ...newTransaction,
                      transactionType: value as
                        | "WITHDRAWAL"
                        | "DEPOSIT"
                        | "PAYMENT"
                        | "INCOME",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='DEPOSIT'>Deposit</SelectItem>
                    <SelectItem value='WITHDRAWAL'>Withdrawal</SelectItem>
                    <SelectItem value='PAYMENT'>Payment</SelectItem>
                    <SelectItem value='INCOME'>Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Input
                  id='description'
                  placeholder='Transaction description'
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='transaction-code'>Transaction Code</Label>
                <Input
                  id='transaction-code'
                  placeholder='Code or category'
                  value={newTransaction.transactionCode}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      transactionCode: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='transaction-date'>Date</Label>
                <Input
                  id='transaction-date'
                  type='date'
                  value={newTransaction.transactionDate}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      transactionDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateTransaction}
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending
                  ? "Creating..."
                  : "Create Transaction"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Summary */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Current Balance
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {accountLoading ? (
              <Skeleton className='h-8 w-24' />
            ) : (
              <div className='text-2xl font-bold'>
                ${(account?.balance || 0).toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Transactions
            </CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {transactionsResponse?.pagination.total || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Income</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
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
            {transactionsLoading ? (
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
              <Label htmlFor='filter-transaction-type'>Transaction Type</Label>
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
              <Label htmlFor='filter-min-amount'>Min Amount</Label>
              <Input
                id='filter-min-amount'
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
              <Label htmlFor='filter-max-amount'>Max Amount</Label>
              <Input
                id='filter-max-amount'
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

      {/* Transactions Table */}
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
                transactionsResponse.transactions.map((transaction: Transaction) => (
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
                  {transactionsResponse.pagination.totalPages} (
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
