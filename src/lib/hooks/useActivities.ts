import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { ActivitiesResponse, Activity } from "@/types";

// API function
const getOrganizationActivities = async (
  organizationId: string,
  page: number = 1,
  limit: number = 10
): Promise<ActivitiesResponse> => {
  const response = await apiClient.get(
    `/activities/organization/${organizationId}`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

// Hooks
export const useOrganizationActivities = (
  organizationId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["activities", "organization", organizationId, page, limit],
    queryFn: () => getOrganizationActivities(organizationId, page, limit),
    enabled: !!organizationId,
  });
};

export const useUpcomingActivities = () => {
  return useQuery({
    queryKey: ["activities", "upcoming"],
    queryFn: (): Promise<Activity[]> => Promise.resolve([]),
    staleTime: Infinity, // Don't refetch mock data
  });
};
