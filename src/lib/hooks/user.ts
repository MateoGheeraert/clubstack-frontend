import { useQuery } from "@tanstack/react-query";
import type { Task, Organization } from "@/types";

// Stub hooks for backward compatibility
// These return empty data - replace with tRPC versions when ready

interface UserStats {
  tasksCompleted: number;
  activitiesAttended: number;
  totalTasks: number;
}

interface UserProfile {
  email: string;
  role: string;
  createdAt: string;
  recentTasks?: Task[];
  organizations?: Organization[];
}

export const useUserMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => Promise.resolve(null),
    staleTime: Infinity,
  });
};

export const useUserProfile = () => {
  return useQuery<UserProfile | null>({
    queryKey: ["user", "profile"],
    queryFn: () => Promise.resolve<UserProfile | null>(null),
    staleTime: Infinity,
  });
};

export const useUserStatsAPI = () => {
  return useQuery<UserStats | null>({
    queryKey: ["user", "stats", "api"],
    queryFn: () => Promise.resolve<UserStats | null>(null),
    staleTime: Infinity,
  });
};

export const useUserStats = () => {
  return useQuery<UserStats | null>({
    queryKey: ["user", "stats"],
    queryFn: () => Promise.resolve<UserStats | null>(null),
    staleTime: Infinity,
  });
};
