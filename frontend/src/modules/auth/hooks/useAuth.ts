import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "LEARNER" | "CREATOR" | "ADMIN";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock: Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login
    const mockUser: User = {
      id: "1",
      email,
      name: "John Doe",
      role: "LEARNER",
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
