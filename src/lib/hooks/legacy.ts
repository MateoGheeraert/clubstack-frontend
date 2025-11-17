import { useQuery } from "@tanstack/react-query";
import type { Activity, Account } from "@/types";

// Stub hooks for backward compatibility
// These return empty data - replace with tRPC versions when ready

export const useUpcomingActivities = () => {
  return useQuery<Activity[]>({
    queryKey: ["activities", "upcoming"],
    queryFn: () => Promise.resolve<Activity[]>([]),
    staleTime: Infinity,
  });
};

export const useMyAccounts = () => {
  return useQuery<Account[]>({
    queryKey: ["accounts", "my"],
    queryFn: () => Promise.resolve<Account[]>([]),
    staleTime: Infinity,
  });
};
