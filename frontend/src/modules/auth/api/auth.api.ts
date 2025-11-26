import { apiClient } from '@/lib/api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'LEARNER' | 'CREATOR' | 'ADMIN';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.instance.post<AuthResponse>('/auth/login', data);
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    apiClient.setTokensPublic(accessToken, refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.instance.post<AuthResponse>('/auth/register', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    });
    
    const { accessToken, refreshToken, user } = response.data;
    
    // Store tokens
    apiClient.setTokensPublic(accessToken, refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await apiClient.instance.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.clearTokensPublic();
    }
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.instance.get<AuthResponse['user']>('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.instance.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.instance.post('/auth/reset-password', {
      token,
      newPassword,
    });
  },

  refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await apiClient.instance.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    apiClient.setTokensPublic(response.data.accessToken, response.data.refreshToken);
    return response.data;
  },
};
