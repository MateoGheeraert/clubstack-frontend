"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateActivity,
  useUpdateActivity,
} from "@/lib/hooks/useTrpcActivities";
import type { Activity } from "@/types";

const activityFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    starts_at: z.string().min(1, "Start date is required"),
    ends_at: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    description: z.string().min(1, "Description is required"),
    nonUserAttendees: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.ends_at) return true; // If no end date, validation passes (we'll set default)
      const startDate = new Date(data.starts_at);
      const endDate = new Date(data.ends_at);
      return endDate >= startDate;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["ends_at"],
    }
  );

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  activity?: Activity;
  onSuccess?: () => void;
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  organizationId,
  activity,
  onSuccess,
}: ActivityFormDialogProps) {
  const isEditing = !!activity;
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      starts_at: "",
      ends_at: "",
      location: "",
      description: "",
      nonUserAttendees: "",
    },
  });

  // Reset form when dialog opens/closes or activity changes
  useEffect(() => {
    if (open && activity) {
      // Convert ISO datetime to datetime-local format
      const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      form.reset({
        title: activity.title || "",
        starts_at: activity.starts_at ? formatDateTime(activity.starts_at) : "",
        ends_at: activity.ends_at ? formatDateTime(activity.ends_at) : "",
        location: activity.location || "",
        description: activity.description || "",
        nonUserAttendees: activity.attendees?.join(", ") || "",
      });
    } else if (open && !activity) {
      form.reset({
        title: "",
        starts_at: "",
        ends_at: "",
        location: "",
        description: "",
        nonUserAttendees: "",
      });
    }
  }, [open, activity, form]);

  const onSubmit = async (values: ActivityFormValues) => {
    try {
      const attendees = values.nonUserAttendees
        ? values.nonUserAttendees
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      // Calculate end date: if not provided, set to 1 hour after start date
      const startDate = new Date(values.starts_at);
      let endDate: Date;
      
      if (values.ends_at) {
        endDate = new Date(values.ends_at);
      } else {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
      }

      const activityData = {
        organizationId,
        title: values.title,
        starts_at: startDate.toISOString(),
        ends_at: endDate.toISOString(),
        location: values.location,
        description: values.description,
        nonUserAttendees: attendees,
      };

      if (isEditing) {
        await updateActivity.mutateAsync({
          activityId: activity.id!,
          data: {
            title: values.title,
            starts_at: startDate.toISOString(),
            ends_at: endDate.toISOString(),
            location: values.location,
            description: values.description,
            nonUserAttendees: attendees,
          },
        });
        console.log("Activity updated successfully");
      } else {
        await createActivity.mutateAsync(activityData);
        console.log("Activity created successfully");
      }

      onOpenChange(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save activity:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this activity."
              : "Fill in the details to create a new activity."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Activity title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="starts_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ends_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time (Optional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      If not set, defaults to 1 hour after start
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Activity location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the activity..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nonUserAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Attendees (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe, Jane Smith (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add names of non-member guests attending this activity.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createActivity.isPending || updateActivity.isPending}
              >
                {createActivity.isPending || updateActivity.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Activity"
                  : "Create Activity"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
