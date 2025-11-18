"use client";

import { useState, useEffect } from "react";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useOrganizationTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/lib/hooks/useTrpcTasks";
import { useOrganizationMembers } from "@/lib/hooks/useTrpcMembers";
import {
  Plus,
  CheckSquare,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Task, OrganizationMember } from "@/types";
import { TaskDetailsDialog } from "@/components/tasks/task-details-dialog";

export default function OrganizationTasksPage() {
  const { selectedOrganization } = useOrganizationContext();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    userId: "",
  });

  const [editTask, setEditTask] = useState({
    id: "",
    title: "",
    description: "",
  });

  const { data: tasksResponse, isLoading } = useOrganizationTasks({
    organizationId: selectedOrganization?.id || "",
    page: 1,
    limit: 100,
    status:
      statusFilter === "all"
        ? undefined
        : (statusFilter as "pending" | "in_progress" | "completed" | "cancelled"),
    userId: userFilter === "all" ? undefined : userFilter,
  });

  const { data: membersData } = useOrganizationMembers(
    selectedOrganization?.id || ""
  );

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const tasks = tasksResponse?.tasks || [];
  const members = membersData || [];

  useEffect(() => {
    if (selectedTask && editDialogOpen) {
      setEditTask({
        id: selectedTask.id,
        title: selectedTask.title,
        description: selectedTask.description || "",
      });
    }
  }, [selectedTask, editDialogOpen]);

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setDetailsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteMutation.mutateAsync({ taskId: taskToDelete });
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!selectedOrganization || !newTask.title || !newTask.userId) return;

    try {
      await createMutation.mutateAsync({
        title: newTask.title,
        description: newTask.description,
        userId: newTask.userId,
        organizationId: selectedOrganization.id,
      });
      setCreateDialogOpen(false);
      setNewTask({ title: "", description: "", userId: "" });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editTask.id || !editTask.title) return;

    try {
      await updateMutation.mutateAsync({
        taskId: editTask.id,
        data: {
          title: editTask.title,
          description: editTask.description,
        },
      });
      setEditDialogOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
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

  if (!selectedOrganization) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please select an organization</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage tasks for {selectedOrganization.name}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {members.map((member: OrganizationMember) => (
              <SelectItem key={member.userId} value={member.userId}>
                {member.user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Manage and track tasks for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: Task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{task.user.email}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {task.description ? (
                        task.description.length > 50
                          ? `${task.description.substring(0, 50)}...`
                          : task.description
                      ) : (
                        "No description"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTask(task)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first task to get started.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Task Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Assign a new task to a member of your organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select
                value={newTask.userId}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, userId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member: OrganizationMember) => (
                    <SelectItem key={member.userId} value={member.userId}>
                      {member.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              disabled={
                !newTask.title || !newTask.userId || createMutation.isPending
              }
            >
              {createMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task title and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                placeholder="Task title"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Task description"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTask}
              disabled={!editTask.title || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Task Details Dialog */}
      <TaskDetailsDialog
        task={selectedTask}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        canUpdateStatus={false}
      />
    </div>
  );
}
