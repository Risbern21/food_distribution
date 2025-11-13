import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';
import api from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  setToken: (token: string) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    const currentToken = localStorage.getItem('auth_token');
    if (!currentToken) return;

    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
      console.error('No email found for /auth/me request');
      return;
    }

    try {
      const response = await api.get(`/auth/me/`);
      const userData = response.data;
      if (userData && typeof userData === 'object') {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      // Failed to fetch user data, but we still have a token
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedToken) {
      setTokenState(storedToken);
    }
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser !== null) {
          setUser(parsedUser);
        } else {
          // Invalid user object, clear it
          localStorage.removeItem('user');
        }
      } catch (error) {
        // Invalid JSON in localStorage, clear it
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    } else if (storedToken && !storedUser) {
      // We have a token but no user, try to fetch user data
      fetchUserData();
    }
  }, [fetchUserData]);

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('auth_token', token);
    setUser(user);
    setTokenState(token);
  }, []);

  const setToken = useCallback((token: string) => {
    localStorage.setItem('auth_token', token);
    setTokenState(token);
    // Try to fetch user data after setting token
    fetchUserData();
  }, [fetchUserData]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setUser(null);
    setTokenState(null);
  }, []);

  // User is authenticated if we have a token (even if user data is not yet loaded)
  const isAuthenticated = !!token || !!localStorage.getItem('auth_token');

  return (
    <AuthContext.Provider value={{ user, login, setToken, fetchUser: fetchUserData, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
