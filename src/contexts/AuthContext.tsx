import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiClient } from '../api/client';
import type { LoginRequest, LoginResponse } from '../api/types';
import { tokenStorage, setupAutoLogout } from '../utils/storage';
import { API_ENDPOINTS, ROUTES } from '../utils/constants';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Create API client with logout callback
  const apiClient = new ApiClient(() => {
    logout();
  });

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = tokenStorage.getToken();
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    // Setup auto logout on token expiry
    setupAutoLogout(() => {
      logout();
    });
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.data) {
        const { token, expires_at } = response.data;
        
        // Store token
        tokenStorage.setToken(token, expires_at);
        setToken(token);
        setIsAuthenticated(true);
        
        // Navigate to students page
        navigate(ROUTES.STUDENTS);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred during login' 
      };
    }
  }, [navigate]);

  const logout = useCallback(() => {
    tokenStorage.clearToken();
    setToken(null);
    setIsAuthenticated(false);
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}