import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "@/types/auth";
import { tokenUtils, userUtils } from "@/lib/auth";

// Auth API functions
const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },
};

// Login mutation
export const useLogin = () => {
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data: AuthResponse) => {
      tokenUtils.setToken(data.token);
      userUtils.setUser(data.user);
      window.location.href = "/dashboard";
    },
  });
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data: AuthResponse) => {
      tokenUtils.setToken(data.token);
      userUtils.setUser(data.user);
      window.location.href = "/dashboard";
    },
  });
};

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: authAPI.getProfile,
    enabled: false, // Disabled until backend is connected
  });
};
