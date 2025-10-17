"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyOrganizations,
  useMyTasks,
  useUpcomingActivities,
  useMyAccounts,
  useUserStats,
} from "@/lib/hooks";
import { Building2, CheckSquare, Calendar, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { data: organizations, isLoading: orgsLoading } = useMyOrganizations();
  const { data: tasksResponse, isLoading: tasksLoading } = useMyTasks(1, 5);
  const tasks = tasksResponse?.tasks || [];
  const { data: activities, isLoading: activitiesLoading } =
    useUpcomingActivities();
  const { data: accounts, isLoading: accountsLoading } = useMyAccounts();
  const { data: stats, isLoading: statsLoading } = useUserStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome back! Here&apos;s what&apos;s happening with your
          organizations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Organizations</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {orgsLoading ? "..." : organizations?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tasks Completed
            </CardTitle>
            <CheckSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {stats?.tasksCompleted || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Activities Attended
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <div className='text-2xl font-bold'>
                {stats?.activitiesAttended || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Balance</CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <Skeleton className='h-8 w-20' />
            ) : (
              <div className='text-2xl font-bold'>
                $
                {accounts
                  ?.reduce((sum, account) => sum + (account?.balance || 0), 0)
                  ?.toFixed(2) || "0.00"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest task assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className='space-y-3'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-6 w-20' />
                  </div>
                ))}
              </div>
            ) : tasks && tasks.length > 0 ? (
              <div className='space-y-3'>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className='flex items-center justify-between'
                  >
                    <div>
                      <p className='font-medium'>{task.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {formatDistanceToNow(new Date(task.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(task.status)}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground'>No recent tasks</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
            <CardDescription>Your scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className='space-y-3'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className='space-y-3'>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-center justify-between'
                  >
                    <div>
                      <p className='font-medium'>{activity.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(activity.starts_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground'>No upcoming activities</p>
            )}
          </CardContent>
        </Card>

        {/* Organizations */}
        <Card>
          <CardHeader>
            <CardTitle>My Organizations</CardTitle>
            <CardDescription>Organizations you&apos;re part of</CardDescription>
          </CardHeader>
          <CardContent>
            {orgsLoading ? (
              <div className='space-y-3'>
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className='h-4 w-32 mb-1' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                ))}
              </div>
            ) : organizations && organizations.length > 0 ? (
              <div className='space-y-3'>
                {organizations.map((org) => (
                  <div key={org.id}>
                    <p className='font-medium'>{org.name}</p>
                    {org.description && (
                      <p className='text-sm text-muted-foreground'>
                        {org.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground'>No organizations found</p>
            )}
          </CardContent>
        </Card>

        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your account balances</CardDescription>
          </CardHeader>
          <CardContent>
            {accountsLoading ? (
              <div className='space-y-3'>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-4 w-16' />
                  </div>
                ))}
              </div>
            ) : accounts && accounts.length > 0 ? (
              <div className='space-y-3'>
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className='flex items-center justify-between'
                  >
                    <p className='font-medium'>{account.accountName}</p>
                    <p className='text-sm font-mono'>
                      ${(account?.balance || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground'>No accounts found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
