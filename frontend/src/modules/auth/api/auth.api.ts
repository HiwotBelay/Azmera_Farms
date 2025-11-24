// Mock API functions for authentication
// These will be replaced with actual API calls when backend is ready

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: "LEARNER" | "CREATOR" | "ADMIN";
  organization?: string;
  bio?: string;
  language?: "en" | "am";
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: "1",
            email: data.email,
            name: "John Doe",
            role: "LEARNER",
          },
          token: "mock-jwt-token",
        });
      }, 1000);
    });
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: "1",
            email: data.email,
            name: data.fullName,
            role: data.role,
          },
          token: "mock-jwt-token",
        });
      }, 1000);
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
};
