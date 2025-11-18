"use client";

import { trpc } from "@/lib/trpc-provider";

/**
 * tRPC-based hooks for tasks
 */

export const useTasks = (options?: {
  page?: number;
  limit?: number;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  organizationId?: string;
}) => {
  return trpc.tasks.getAll.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
    status: options?.status,
    organizationId: options?.organizationId,
  });
};

export const useMyTasks = (options?: {
  page?: number;
  limit?: number;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  organizationId?: string;
}) => {
  return trpc.tasks.getMyTasks.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
    status: options?.status,
    organizationId: options?.organizationId,
  });
};

export const useOrganizationTasks = (options: {
  organizationId: string;
  page?: number;
  limit?: number;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  userId?: string;
}) => {
  return trpc.tasks.getOrganizationTasks.useQuery({
    organizationId: options.organizationId,
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
    status: options?.status,
    userId: options?.userId,
  });
};

export const useTask = (taskId: string) => {
  return trpc.tasks.getById.useQuery(
    { taskId },
    {
      enabled: !!taskId,
    }
  );
};

export const useCreateTask = () => {
  const utils = trpc.useUtils();
  return trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
};

export const useUpdateTask = () => {
  const utils = trpc.useUtils();
  return trpc.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
};

export const useUpdateTaskStatus = () => {
  const utils = trpc.useUtils();
  return trpc.tasks.updateStatus.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
};

export const useDeleteTask = () => {
  const utils = trpc.useUtils();
  return trpc.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.invalidate();
    },
  });
};
