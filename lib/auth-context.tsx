"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth in localStorage
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const { user: storedUser, token: storedToken } = JSON.parse(storedAuth);
      setUser(storedUser);
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    const userData: User = { email, firstName: "", lastName: "" }; // You might want to get this from the API response
    setUser(userData);
    setToken(response.token);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify({ user: userData, token: response.token }));
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await api.register({ email, password, firstName, lastName });
    const userData: User = { email, firstName, lastName };
    setUser(userData);
    setToken(response.token);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify({ user: userData, token: response.token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
