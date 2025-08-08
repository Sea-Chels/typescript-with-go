import { useState, useCallback, useMemo } from 'react';
import { ApiClient } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { ApiResponse } from '../api/types';

interface UseApiReturn {
  server: {
    get: <T = any>(endpoint: string) => Promise<ApiResponse<T>>;
    post: <T = any>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
    put: <T = any>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
    delete: <T = any>(endpoint: string) => Promise<ApiResponse<T>>;
    patch: <T = any>(endpoint: string, data?: any) => Promise<ApiResponse<T>>;
  };
  loading: boolean;
  error: string | null;
}

export function useApi(): UseApiReturn {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create API client with logout callback
  const apiClient = useMemo(() => {
    return new ApiClient(() => {
      // Handle unauthorized errors by logging out
      logout();
    });
  }, [logout]);

  const makeRequest = useCallback(async <T,>(
    requestFn: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestFn();
      
      if (!response.success && response.error) {
        setError(response.error.message);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        status: 0,
        error: {
          message: errorMessage,
        },
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const server = useMemo(() => ({
    get: <T = any>(endpoint: string) => 
      makeRequest<T>(() => apiClient.get<T>(endpoint)),
    
    post: <T = any>(endpoint: string, data?: any) => 
      makeRequest<T>(() => apiClient.post<T>(endpoint, data)),
    
    put: <T = any>(endpoint: string, data?: any) => 
      makeRequest<T>(() => apiClient.put<T>(endpoint, data)),
    
    delete: <T = any>(endpoint: string) => 
      makeRequest<T>(() => apiClient.delete<T>(endpoint)),
    
    patch: <T = any>(endpoint: string, data?: any) => 
      makeRequest<T>(() => apiClient.patch<T>(endpoint, data)),
  }), [apiClient, makeRequest]);

  return {
    server,
    loading,
    error,
  };
}