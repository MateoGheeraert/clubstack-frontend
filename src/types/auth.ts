export interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: string;
}
