import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { UserMe, UserProfile, UserStatsAPI, UserStats } from "@/types";

// API functions
const getUserMe = async (): Promise<UserMe> => {
  const response = await apiClient.get("/user/me");
  return response.data;
};

const getUserProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get("/user/profile");
  return response.data;
};

const getUserStats = async (): Promise<UserStatsAPI> => {
  const response = await apiClient.get("/user/stats");
  return response.data;
};

// Hooks
export const useUserMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getUserMe,
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
  });
};

export const useUserStatsAPI = () => {
  return useQuery({
    queryKey: ["user", "stats", "api"],
    queryFn: getUserStats,
  });
};

export const useUserStats = () => {
  return useQuery({
    queryKey: ["user", "stats"],
    queryFn: (): Promise<UserStats> =>
      Promise.resolve({
        tasksCompleted: 0,
        activitiesAttended: 0,
        organizationCount: 0,
      }),
    staleTime: Infinity, // Don't refetch mock data
  });
};
