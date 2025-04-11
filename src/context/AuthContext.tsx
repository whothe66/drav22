
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

// Type definitions
interface User {
  id: string;
  larkId: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for callback URL
  useEffect(() => {
    // Check if we're on the callback route
    if (location.pathname === '/auth/callback') {
      const url = new URL(window.location.href);
      const token = url.searchParams.get('token');
      if (token) {
        handleAuthCallback(token);
      }
    }
  }, [location]);

  // Function to initiate Lark login
  const login = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.login();
      const { authUrl, state } = response.data;
      
      // Store state in localStorage for validation later
      localStorage.setItem('lark_auth_state', state);
      
      // Redirect to Lark authorization page
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to initialize login');
      setIsLoading(false);
    }
  };

  // Function to handle the auth callback
  const handleAuthCallback = async (token: string) => {
    try {
      // Store token in both cookie and localStorage for compatibility
      Cookies.set('auth_token', token, { expires: 7 });
      localStorage.setItem('authToken', token);
      
      // Fetch user data
      await checkAuth();
      
      // Navigate to dashboard
      navigate('/');
      toast.success('Successfully logged in');
    } catch (error) {
      console.error('Auth callback error:', error);
      toast.error('Authentication failed');
      setIsLoading(false);
    }
  };

  // Function to check authentication status
  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    // Check in both cookie and localStorage
    const token = Cookies.get('auth_token') || localStorage.getItem('authToken');
    
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return false;
    }
    
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Auth check error:', error);
      Cookies.remove('auth_token');
      localStorage.removeItem('authToken');
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  // Function to logout
  const logout = () => {
    Cookies.remove('auth_token');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user, 
      login, 
      logout,
      checkAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
