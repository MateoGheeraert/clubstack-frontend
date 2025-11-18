"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckSquare, Clock, AlertCircle, Building2, User } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/types";
import { useUpdateTaskStatus } from "@/lib/hooks/useTrpcTasks";

interface TaskDetailsDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canUpdateStatus?: boolean;
}

export function TaskDetailsDialog({
  task,
  open,
  onOpenChange,
  canUpdateStatus = true,
}: TaskDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "in_progress" | "completed" | "cancelled"
  >(task?.status || "pending");
  const updateStatusMutation = useUpdateTaskStatus();

  if (!task) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "destructive";
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        taskId: task.id,
        status: selectedStatus,
      });
      onOpenChange(false);
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
          <DialogDescription>Task details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex items-center space-x-3">
              {getStatusIcon(task.status)}
              <Badge variant={getStatusColor(task.status)}>
                {task.status.replace("_", " ")}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <p className="text-muted-foreground">
              {task.description || "No description provided"}
            </p>
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Organization
            </label>
            <p className="text-muted-foreground">{task.organization.name}</p>
          </div>

          {/* Assigned User */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Assigned To
            </label>
            <p className="text-muted-foreground">{task.user.email}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Created At</label>
              <p className="text-muted-foreground">
                {format(new Date(task.createdAt), "PPP")}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Updated</label>
              <p className="text-muted-foreground">
                {format(new Date(task.updatedAt), "PPP")}
              </p>
            </div>
          </div>

          {/* Update Status Section */}
          {canUpdateStatus && (
            <div className="border-t pt-4 space-y-4">
              <label className="text-sm font-medium">Update Status</label>
              <div className="flex items-center space-x-3">
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(
                      value as "pending" | "in_progress" | "completed" | "cancelled"
                    )
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={
                    selectedStatus === task.status ||
                    updateStatusMutation.isPending
                  }
                >
                  {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
