import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth.api';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'LEARNER' | 'CREATOR' | 'ADMIN';
  isEmailVerified?: boolean;
  isActive?: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');

      if (storedUser && accessToken) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authApi.getMe();
          setUser(currentUser as User);
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setUser(response.user as User);
      return response.user as User;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'LEARNER' | 'CREATOR' | 'ADMIN';
  }) => {
    try {
      const response = await authApi.register(data);
      setUser(response.user as User);
      return response.user as User;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
