"use client";

import { useState } from "react";
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
import { useMyTasks } from "@/lib/hooks";
import { Plus, CheckSquare, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { data: tasksResponse, isLoading } = useMyTasks(
    page,
    10,
    statusFilter === "all" ? undefined : statusFilter
  );

  // Deduplicate tasks by title and status (in case backend returns duplicates)
  const allTasks = tasksResponse?.tasks || [];
  const tasks = allTasks.filter(
    (task, index, arr) =>
      index ===
      arr.findIndex((t) => t.title === task.title && t.status === task.status)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckSquare className='h-4 w-4 text-green-600' />;
      case "in_progress":
        return <Clock className='h-4 w-4 text-blue-600' />;
      case "pending":
        return <AlertCircle className='h-4 w-4 text-yellow-600' />;
      default:
        return <AlertCircle className='h-4 w-4 text-red-600' />;
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>My Tasks</h1>
          <p className='text-muted-foreground'>
            Manage your assigned tasks and track progress
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className='flex items-center space-x-4'>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='in_progress'>In Progress</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
            <SelectItem value='cancelled'>Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>A list of all your assigned tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center space-x-4'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-6 w-20' />
                  <Skeleton className='h-4 w-24' />
                </div>
              ))}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        {getStatusIcon(task.status)}
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>{task.title}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {task.description || "No description"}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(task.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <Button variant='outline' size='sm'>
                          View
                        </Button>
                        {task.status !== "completed" && (
                          <Button size='sm'>Update</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='flex flex-col items-center justify-center py-12'>
              <CheckSquare className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold'>No tasks found</h3>
              <p className='text-muted-foreground mb-4'>
                You don&apos;t have any tasks assigned yet.
              </p>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Create Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
