"use client";

import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { trpc } from "@/lib/trpc-provider";
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
  CalendarIcon,
  UsersIcon,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ListTodo,
} from "lucide-react";
import { format, isPast, isFuture } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function OrganizationDashboardPage() {
  const { selectedOrganization } = useOrganizationContext();

  // Fetch organization details
  const { data: organization, isLoading: orgLoading } =
    trpc.organizations.getById.useQuery(
      { organizationId: selectedOrganization?.id ?? "" },
      { enabled: !!selectedOrganization?.id }
    );

  // Fetch activities
  const { data: activitiesData, isLoading: activitiesLoading } =
    trpc.activities.getByOrganization.useQuery(
      {
        organizationId: selectedOrganization?.id ?? "",
        page: 1,
        limit: 100, // Get all activities to count them
      },
      { enabled: !!selectedOrganization?.id }
    );

  // Fetch members
  const { data: members, isLoading: membersLoading } =
    trpc.members.getByOrganization.useQuery(
      { organizationId: selectedOrganization?.id ?? "" },
      { enabled: !!selectedOrganization?.id }
    );

  // Fetch accounts (financial data - admin only)
  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
  } = trpc.accounts.getByOrganization.useQuery(
    { organizationId: selectedOrganization?.id ?? "" },
    { 
      enabled: !!selectedOrganization?.id,
      retry: false, // Don't retry if forbidden (non-admin)
    }
  );

  // Fetch all tasks
  const { data: tasksData, isLoading: tasksLoading } = trpc.tasks.getAll.useQuery(
    {
      page: 1,
      limit: 100, // Get all tasks
    },
    { enabled: !!selectedOrganization?.id }
  );

  if (!selectedOrganization) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertDescription>
            Please select an organization to view the dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate activity statistics
  const passedActivities =
    activitiesData?.activities.filter((activity) =>
      isPast(new Date(activity.ends_at))
    ) ?? [];
  const upcomingActivities =
    activitiesData?.activities.filter((activity) =>
      isFuture(new Date(activity.starts_at))
    ) ?? [];

  // Get recent tasks (limit to 5 most recent)
  const recentTasks = tasksData?.tasks.slice(0, 5) ?? [];

  // Calculate total balance (admin only feature)
  const totalBalance =
    accounts?.reduce((sum, account) => sum + account.balance, 0) ?? 0;

  const isLoading =
    orgLoading ||
    activitiesLoading ||
    membersLoading ||
    accountsLoading ||
    tasksLoading;

  return (
    <div className="container space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {organization?.name ?? "Organization Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of your organization&apos;s activities and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{members?.length ?? 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active members in organization
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Activities
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {upcomingActivities.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled events
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Passed Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Past Activities
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {passedActivities.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed events
                </p>
              </>
            )}
          </CardContent>
        </Card>


        {/* Active Tasks - Shown when not admin to fill the grid */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tasks
              </CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {tasksData?.tasks.filter((t) => t.status !== "completed")
                      .length ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pending & in progress
                  </p>
                </>
              )}
            </CardContent>
          </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Latest tasks from all organization members
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No tasks found
              </p>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.user.email}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "default"
                          : task.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Activities</CardTitle>
            <CardDescription>
              Next scheduled events and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : upcomingActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No upcoming activities
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 border-b pb-4 last:border-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.starts_at), "PPP")} at{" "}
                        {format(new Date(activity.starts_at), "p")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        📍 {activity.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Overview - Admin Only */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Account balances and summary</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts!.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {account.accountName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            account.balance >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ${account.balance.toFixed(2)}
                        </p>
                        {account.balance >= 0 ? (
                          <TrendingUp className="ml-auto h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="ml-auto h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
