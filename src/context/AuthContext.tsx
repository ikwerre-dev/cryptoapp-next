'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth-token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const mockToken = 'mock-jwt-token';
      Cookies.set('auth-token', mockToken, { expires: 7 });
      setIsAuthenticated(true);

      console.log('Login successful, redirecting...');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth-token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const mockToken = 'mock-jwt-token';
      Cookies.set('auth-token', mockToken, { expires: 7 });
      setIsAuthenticated(true);

      console.log('Signup successful, redirecting...');
      router.push('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};