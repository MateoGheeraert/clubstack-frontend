"use client";

import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMyActivities,
  useJoinActivity,
  useLeaveActivity,
} from "@/lib/hooks/useTrpcActivities";
import { useMyOrganizations } from "@/lib/hooks/useTrpcOrganizations";
import { ActivityDetailsDialog } from "@/components/activities/activity-details-dialog";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  List,
  CalendarDays,
  Users,
  Check,
  X,
  ArrowUpDown,
} from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  startOfWeek, 
  endOfWeek,
} from "date-fns";
import type { Activity } from "@/types";

type ViewMode = "calendar" | "list";
type FilterMode = "all" | "joined" | "notJoined";
type SortMode = "date-asc" | "date-desc";

export default function PersonalActivitiesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sortMode, setSortMode] = useState<SortMode>("date-asc");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const { data: activitiesResponse, isLoading: activitiesLoading } =
    useMyActivities();
  const { data: organizations, isLoading: orgsLoading } = useMyOrganizations();
  const joinActivity = useJoinActivity();
  const leaveActivity = useLeaveActivity();

  // Check if user has joined an activity (simplified - you'd need user ID from context)
  const hasJoined = (activity: Activity) => {
    // This is a placeholder - you would need to check if the current user's ID
    // is in the activity's user attendees list (not the string attendees array)
    // For now, we'll check if there are any attendees as a proxy
    return activity.attendees && activity.attendees.length > 0;
  };

  // Filter activities based on selected filters
  const filteredActivities = useMemo(() => {
    const activities = activitiesResponse?.activities || [];
    let filtered = activities;

    // Only apply filters in list view
    if (viewMode === "list") {
      // Filter by organization
      if (selectedOrg !== "all") {
        filtered = filtered.filter((a) => a.organizationId === selectedOrg);
      }

      // Filter by join status
      if (filterMode === "joined") {
        filtered = filtered.filter((a) => hasJoined(a));
      } else if (filterMode === "notJoined") {
        filtered = filtered.filter((a) => !hasJoined(a));
      }
    }

    // Sort by date (applies to both views)
    filtered.sort((a, b) => {
      const dateA = new Date(a.starts_at).getTime();
      const dateB = new Date(b.starts_at).getTime();
      return sortMode === "date-asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [activitiesResponse, selectedOrg, filterMode, sortMode, viewMode]);

  // Calendar view logic
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get activities for a specific day (including multi-day activities)
  const getActivitiesForDay = (day: Date) => {
    return filteredActivities.filter((activity) => {
      const activityStart = new Date(activity.starts_at);
      const activityEnd = new Date(activity.ends_at);
      
      // Set all times to start of day for comparison
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Check if the day falls within the activity's date range
      return (
        (activityStart <= dayEnd && activityEnd >= dayStart)
      );
    });
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setDetailsDialogOpen(true);
  };

  const handleJoinToggle = async (activity: Activity) => {
    try {
      if (hasJoined(activity)) {
        await leaveActivity.mutateAsync({ activityId: activity.id! });
      } else {
        await joinActivity.mutateAsync({ activityId: activity.id! });
      }
    } catch (error) {
      console.error("Failed to toggle activity join status:", error);
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Activities</h1>
        <p className="text-muted-foreground">
          View and manage your personal activities across all organizations
        </p>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Organization Filter */}
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Organizations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {organizations?.map((org) => (
                <SelectItem key={org.id} value={org.id!}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Join Status Filter */}
          <Select value={filterMode} onValueChange={(v) => setFilterMode(v as FilterMode)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="joined">Joined Only</SelectItem>
              <SelectItem value="notJoined">Not Joined</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter - Only in List View */}
          {viewMode === "list" && (
            <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Date (Oldest First)
                  </div>
                </SelectItem>
                <SelectItem value="date-desc">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Date (Newest First)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-2 h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {(activitiesLoading || orgsLoading) && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {!activitiesLoading && !orgsLoading && viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, idx) => {
                const dayActivities = getActivitiesForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] border rounded-md p-2 ${
                      !isCurrentMonth ? "bg-muted/50" : ""
                    } ${isToday ? "border-primary border-2" : ""}`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                            hasJoined(activity)
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                          }`}
                          title={activity.title}
                          onClick={() => handleActivityClick(activity)}
                        >
                          <div className="truncate font-medium">
                            {activity.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {format(new Date(activity.starts_at), "HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30"></div>
                <span className="text-sm">Joined</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30"></div>
                <span className="text-sm">Not Joined</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List View */}
      {!activitiesLoading && !orgsLoading && viewMode === "list" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const joined = hasJoined(activity);
              return (
                <Card
                  key={activity.id}
                  className={`hover:shadow-md transition-shadow ${
                    joined ? "border-green-500/50" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex gap-2">
                        <Badge
                          variant={joined ? "default" : "outline"}
                          className={
                            joined
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {joined ? (
                            <>
                              <Check className="mr-1 h-3 w-3" /> Joined
                            </>
                          ) : (
                            <>
                              <X className="mr-1 h-3 w-3" /> Not Joined
                            </>
                          )}
                        </Badge>
                        {new Date(activity.starts_at) > new Date() && (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {activity.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {activity.organization?.name || "Unknown Organization"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {format(new Date(activity.starts_at), "PPp")}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-2 w-4" />
                        <span>
                          to {format(new Date(activity.ends_at), "PPp")}
                        </span>
                      </div>

                      {activity.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                      )}

                      {activity.attendees && activity.attendees.length > 0 && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="mr-2 h-4 w-4" />
                          <span>{activity.attendees.length} attendees</span>
                        </div>
                      )}

                      {activity.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activity.description}
                        </p>
                      )}

                      <Button
                        className="w-full mt-2"
                        variant={joined ? "outline" : "default"}
                        onClick={() => handleJoinToggle(activity)}
                        disabled={
                          joinActivity.isPending || leaveActivity.isPending
                        }
                      >
                        {joined ? "Leave Activity" : "Join Activity"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center p-12">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No activities found</h3>
              <p className="text-muted-foreground">
                There are no activities matching your current filters.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Activity Details Dialog */}
      <ActivityDetailsDialog
        activity={selectedActivity}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onJoin={(activityId) => {
          joinActivity.mutateAsync({ activityId }).then(() => {
            setDetailsDialogOpen(false);
          });
        }}
        onLeave={(activityId) => {
          leaveActivity.mutateAsync({ activityId }).then(() => {
            setDetailsDialogOpen(false);
          });
        }}
        isJoined={selectedActivity ? hasJoined(selectedActivity) : false}
        isLoading={joinActivity.isPending || leaveActivity.isPending}
      />
    </div>
  );
}
