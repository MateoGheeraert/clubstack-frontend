"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Users, Building2 } from "lucide-react";
import { format } from "date-fns";
import type { Activity } from "@/types";

interface ActivityDetailsDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin?: (activityId: string) => void;
  onLeave?: (activityId: string) => void;
  isJoined?: boolean;
  isLoading?: boolean;
}

export function ActivityDetailsDialog({
  activity,
  open,
  onOpenChange,
  onJoin,
  onLeave,
  isJoined = false,
  isLoading = false,
}: ActivityDetailsDialogProps) {
  if (!activity) return null;

  const isPast = new Date(activity.ends_at) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{activity.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {activity.organization?.name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4" />
                    {activity.organization.name}
                  </div>
                )}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {isJoined && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Joined
                </Badge>
              )}
              <Badge variant={isPast ? "secondary" : "default"}>
                {isPast ? "Past" : "Upcoming"}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Date & Time</span>
            </div>
            <div className="ml-6 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>Start:</strong>{" "}
                  {format(new Date(activity.starts_at), "PPPp")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm ml-6">
                <span>
                  <strong>End:</strong>{" "}
                  {format(new Date(activity.ends_at), "PPPp")}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          {activity.location && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location</span>
              </div>
              <div className="ml-6 text-sm">{activity.location}</div>
            </div>
          )}

          {/* Description */}
          {activity.description && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Description</div>
              <div className="ml-6 text-sm text-muted-foreground whitespace-pre-wrap">
                {activity.description}
              </div>
            </div>
          )}

          {/* Attendees */}
          {activity.attendees && activity.attendees.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Guest Attendees ({activity.attendees.length})</span>
              </div>
              <div className="ml-6 text-sm">
                <div className="flex flex-wrap gap-2">
                  {activity.attendees.map((attendee, idx) => (
                    <Badge key={idx} variant="outline">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter>
          {!isPast && onJoin && onLeave && (
            <Button
              onClick={() =>
                isJoined ? onLeave(activity.id!) : onJoin(activity.id!)
              }
              disabled={isLoading}
              variant={isJoined ? "outline" : "default"}
              className="w-full sm:w-auto"
            >
              {isLoading
                ? "Processing..."
                : isJoined
                ? "Leave Activity"
                : "Join Activity"}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
