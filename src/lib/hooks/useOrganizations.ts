import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { UserOrganization } from "@/types";

// API function
const getMyOrganizations = async (): Promise<UserOrganization[]> => {
  const response = await apiClient.get("/organizations/my");
  return response.data;
};

// Hook
export const useMyOrganizations = () => {
  return useQuery({
    queryKey: ["organizations", "my"],
    queryFn: getMyOrganizations,
  });
};
