"use client";

import { trpc } from "@/lib/trpc-provider";

/**
 * tRPC-based hooks for activities
 */

export const useActivities = (options?: { page?: number; limit?: number }) => {
  return trpc.activities.getAll.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
  });
};

export const useOrganizationActivities = (
  organizationId: string,
  options?: { page?: number; limit?: number }
) => {
  return trpc.activities.getByOrganization.useQuery(
    {
      organizationId,
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
    },
    {
      enabled: !!organizationId,
    }
  );
};

export const useActivity = (activityId: string) => {
  return trpc.activities.getById.useQuery(
    { activityId },
    {
      enabled: !!activityId,
    }
  );
};

export const useCreateActivity = () => {
  const utils = trpc.useUtils();
  return trpc.activities.create.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });
};

export const useUpdateActivity = () => {
  const utils = trpc.useUtils();
  return trpc.activities.update.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });
};

export const useDeleteActivity = () => {
  const utils = trpc.useUtils();
  return trpc.activities.delete.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });
};

export const useMyActivities = (options?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  return trpc.activities.getMyActivities.useQuery({
    page: options?.page ?? 1,
    limit: options?.limit ?? 100,
    startDate: options?.startDate,
    endDate: options?.endDate,
  });
};

export const useJoinActivity = () => {
  const utils = trpc.useUtils();
  return trpc.activities.joinActivity.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });
};

export const useLeaveActivity = () => {
  const utils = trpc.useUtils();
  return trpc.activities.leaveActivity.useMutation({
    onSuccess: () => {
      utils.activities.invalidate();
    },
  });
};

export const useActivityAttendees = (activityId: string) => {
  return trpc.activities.getActivityAttendees.useQuery(
    { activityId },
    {
      enabled: !!activityId,
    }
  );
};
