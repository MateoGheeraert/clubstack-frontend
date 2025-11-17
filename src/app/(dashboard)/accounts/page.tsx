"use client";

import { useRouter } from "next/navigation";
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
import { useOrganizationAccounts } from "@/lib/hooks/useTrpcAccounts";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Plus, Wallet, DollarSign, ChevronRight } from "lucide-react";
import type { Account } from "@/types";

export default function AccountsPage() {
  const router = useRouter();
  const { selectedOrganizationId } = useOrganizationContext();

  const { data: accounts, isLoading: accountsLoading } =
    useOrganizationAccounts(selectedOrganizationId || "");

  const totalBalance =
    accounts?.reduce((sum: number, account: Account) => sum + account.balance, 0) || 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Accounts</h1>
          <p className='text-muted-foreground'>
            Manage your organization&apos;s financial accounts
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          New Account
        </Button>
      </div>

      {/* Account Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
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
              Total Accounts
            </CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>{accounts?.length || 0}</div>
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
            {accountsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {accounts?.filter((acc: Account) => acc.balance >= 0).length || 0}
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
            Click on an account to view details and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accountsLoading ? (
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
          ) : accounts && accounts.length > 0 ? (
            <div className='space-y-3'>
              {accounts.map((account: Account) => (
                <div
                  key={account.id}
                  className='flex items-center justify-between p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors group'
                  onClick={() => router.push(`/accounts/${account.id}`)}
                >
                  <div className='flex items-center space-x-4'>
                    <Wallet className='h-8 w-8 text-muted-foreground' />
                    <div>
                      <h3 className='font-semibold'>{account.accountName}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {account.type} • Created{" "}
                        {new Date(account.createdAt).toLocaleDateString()} •{" "}
                        {account._count?.Transaction || 0} transactions
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <div className='text-lg font-semibold'>
                        ${(account?.balance || 0).toFixed(2)}
                      </div>
                      <Badge
                        variant={
                          (account?.balance || 0) >= 0
                            ? "default"
                            : "destructive"
                        }
                      >
                        {(account?.balance || 0) >= 0 ? "Positive" : "Negative"}
                      </Badge>
                    </div>
                    <ChevronRight className='h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors' />
                  </div>
                </div>
              ))}
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
              <h3 className='text-lg font-semibold'>No accounts found</h3>
              <p className='text-muted-foreground mb-4'>
                This organization doesn&apos;t have any accounts yet.
              </p>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Create Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
