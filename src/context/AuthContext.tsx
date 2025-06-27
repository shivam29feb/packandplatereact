import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginUser, logout as logoutService } from '../services/loginService';
import { adminLogin, adminLogout } from '../services/adminAuthService';

export type UserType = 'admin' | 'system-admin' | 'member' | 'customer';

// Define user interface
export interface User {
  id: string;
  username: string;
  email: string;
  type: UserType;
}

// Define authentication context interface
interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: UserType) => Promise<LoginResult>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create the context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser && storedAuth === 'true') {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Found user in localStorage:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    } else {
      console.log('No valid auth found in localStorage');
      // Clear any invalid auth state
      if (storedUser) localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }, []);

  // Login function
  const login = async (email: string, password: string, userType: UserType): Promise<LoginResult> => {
    console.log('=== AuthContext: login called ===');
    console.log('Email:', email, 'UserType:', userType);
    setIsLoading(true);
    setError(null);
    
    try {
      let response: { success: boolean; message?: string; user?: any };
      
      if (userType === 'admin') {
        // Use admin login service for admin users
        const adminResponse = await adminLogin(email, password);
        response = {
          success: adminResponse.success,
          message: adminResponse.message,
          user: adminResponse.user ? {
            id: adminResponse.user.id,
            username: adminResponse.user.username,
            email: adminResponse.user.email,
            type: 'admin' as const
          } : undefined
        };
      } else {
        // Use regular login service for other user types
        const regularResponse = await loginUser(email, password, userType);
        response = {
          success: regularResponse.success,
          message: regularResponse.message,
          user: regularResponse.user ? {
            id: regularResponse.user.id,
            username: regularResponse.user.username || '',
            email: regularResponse.user.email,
            type: regularResponse.user.type as UserType
          } : undefined
        };
      }
      
      console.log('Login response:', response);
      
      if (response.success && response.user) {
        const user: User = response.user;
        
        console.log('Setting user in state and localStorage:', user);
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        
        return { success: true, user };
      } else {
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
        return { success: false };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      console.log('=== AuthContext: Logging out ===');
      const currentUser = user; // Store user before clearing
      
      // Clear client-side state first
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear all auth-related data from localStorage and sessionStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.clear();

      // Clear all cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      });
      
      // Call appropriate logout API
      if (currentUser?.type === 'admin') {
        await adminLogout();
      } else {
        await logoutService();
      }

      // Force a hard redirect to ensure all state is cleared
      window.location.href = '/login';
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
      // Still redirect even if there's an error
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

