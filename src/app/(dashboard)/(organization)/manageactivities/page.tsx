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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useOrganizationActivities,
  useDeleteActivity,
} from "@/lib/hooks/useTrpcActivities";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { ActivityFormDialog } from "@/components/activities/activity-form-dialog";
import { Plus, Calendar, MapPin, Clock, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import type { Activity } from "@/types";

type SortMode = "date-asc" | "date-desc";

// Activity Card Component
interface ActivityCardProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
  isPast?: boolean;
}

function ActivityCard({ activity, onEdit, onDelete, isPast = false }: ActivityCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${isPast ? "opacity-75" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Calendar className="h-6 w-6 text-muted-foreground" />
          <Badge variant={isPast ? "secondary" : "default"}>
            {isPast ? "Past" : "Upcoming"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2">{activity.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {activity.description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{format(new Date(activity.starts_at), "PPp")}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2 w-4" />
            <span>to {format(new Date(activity.ends_at), "PPp")}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{activity.location}</span>
          </div>

          {activity.attendees && activity.attendees.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-2 w-4" />
              <span>{activity.attendees.length} guest attendees</span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(activity)}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onDelete(activity.id!)}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ActivitiesPage() {
  const { selectedOrganizationId } = useOrganizationContext();
  const { data: activitiesResponse, isLoading } = useOrganizationActivities(
    selectedOrganizationId || ""
  );
  const deleteActivity = useDeleteActivity();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(
    undefined
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("date-asc");

  // Separate and sort activities into upcoming and past
  const { upcomingActivities, pastActivities } = useMemo(() => {
    const activities = activitiesResponse?.activities || [];
    const now = new Date();

    const upcoming: Activity[] = [];
    const past: Activity[] = [];

    activities.forEach((activity) => {
      if (new Date(activity.starts_at) > now) {
        upcoming.push(activity);
      } else {
        past.push(activity);
      }
    });

    // Sort based on sortMode
    const sortFn = (a: Activity, b: Activity) => {
      const dateA = new Date(a.starts_at).getTime();
      const dateB = new Date(b.starts_at).getTime();
      return sortMode === "date-asc" ? dateA - dateB : dateB - dateA;
    };

    upcoming.sort(sortFn);
    past.sort(sortFn);

    return { upcomingActivities: upcoming, pastActivities: past };
  }, [activitiesResponse, sortMode]);

  const handleCreateNew = () => {
    setEditingActivity(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (activityId: string) => {
    setActivityToDelete(activityId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (activityToDelete) {
      try {
        await deleteActivity.mutateAsync({ activityId: activityToDelete });
        setDeleteDialogOpen(false);
        setActivityToDelete(null);
      } catch (error) {
        console.error("Failed to delete activity:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Activities</h1>
          <p className="text-muted-foreground">
            Manage activities and events for your organization
          </p>
        </div>
        <div className="flex gap-2">
          {/* Sort Selector */}
          <Select value={sortMode} onValueChange={(v) => setSortMode(v as SortMode)}>
            <SelectTrigger className="w-[200px]">
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
          
          <Button onClick={handleCreateNew} disabled={!selectedOrganizationId}>
            <Plus className="mr-2 h-4 w-4" />
            New Activity
          </Button>
        </div>
      </div>

      {isLoading ? (
        // Loading state
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !selectedOrganizationId ? (
        // No organization selected
        <div className="flex flex-col items-center justify-center text-center p-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Select an Organization</h3>
          <p className="text-muted-foreground mb-4">
            Please select an organization in the top bar to view its activities.
          </p>
        </div>
      ) : upcomingActivities.length === 0 && pastActivities.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center text-center p-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No activities found</h3>
          <p className="text-muted-foreground mb-4">
            There are no activities for this organization at the moment.
          </p>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Create Activity
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Activities */}
          {upcomingActivities.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Upcoming Activities</h2>
                <Badge variant="default">{upcomingActivities.length}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Activities */}
          {pastActivities.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">Past Activities</h2>
                <Badge variant="secondary">{pastActivities.length}</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pastActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    isPast
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Form Dialog */}
      <ActivityFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        organizationId={selectedOrganizationId || ""}
        activity={editingActivity}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              activity.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
