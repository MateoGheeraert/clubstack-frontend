import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { TasksResponse } from "@/types";

// API function
const getMyTasks = async (
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<TasksResponse> => {
  const params: { page: number; limit: number; status?: string } = {
    page,
    limit,
  };
  if (status) {
    params.status = status;
  }

  const response = await apiClient.get("/tasks/my", {
    params,
  });
  return response.data;
};

// Hooks
export const useMyTasks = (
  page: number = 1,
  limit: number = 10,
  status?: string
) => {
  return useQuery({
    queryKey: ["tasks", "my", page, limit, status],
    queryFn: () => getMyTasks(page, limit, status),
  });
};

export const useRecentTasks = () => {
  return useQuery({
    queryKey: ["tasks", "recent"],
    queryFn: () => Promise.resolve([]),
    staleTime: Infinity, // Don't refetch mock data
  });
};
