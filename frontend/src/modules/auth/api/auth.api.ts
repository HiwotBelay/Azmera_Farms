import { apiClient } from '@/lib/api';

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'LEARNER' | 'CREATOR' | 'ADMIN';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    const token = response.accessToken || response.access_token;
    if (token) apiClient.setToken(token);
    return response;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    const token = response.accessToken || response.access_token;
    if (token) apiClient.setToken(token);
    return response;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout', {});
    apiClient.setToken(null);
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    apiClient.setToken(response.access_token);
    return response;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<{ message: string }> => {
    return apiClient.post('/auth/reset-password', { token, password });
  },
};
