import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG, RETRY_CONFIG } from './config';
import type { ApiResponse, ApiError } from './types';
import { tokenStorage } from '../utils/storage';
import { ERROR_MESSAGES, HTTP_STATUS } from '../utils/constants';

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private onUnauthorized?: () => void;

  constructor(onUnauthorized?: () => void) {
    this.onUnauthorized = onUnauthorized;
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS,
    });
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = tokenStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401/403 errors
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED || 
            error.response?.status === HTTP_STATUS.FORBIDDEN) {
          tokenStorage.clearToken();
          if (this.onUnauthorized) {
            this.onUnauthorized();
          }
          return Promise.reject(error);
        }

        // Retry logic for network errors
        if (!error.response && !originalRequest._retry && originalRequest._retryCount < RETRY_CONFIG.retries) {
          originalRequest._retry = true;
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
          
          await new Promise(resolve => 
            setTimeout(resolve, RETRY_CONFIG.retryDelay(originalRequest._retryCount))
          );
          
          return this.axiosInstance(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      success: true,
    };
  }

  private handleError(error: AxiosError): ApiResponse {
    let errorMessage = ERROR_MESSAGES.DEFAULT;
    let errorCode: string | undefined;

    if (!error.response) {
      // Network error
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      errorCode = 'NETWORK_ERROR';
    } else {
      // HTTP error
      const status = error.response.status;
      const responseData = error.response.data as any;

      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          errorMessage = responseData?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case HTTP_STATUS.UNAUTHORIZED:
          errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
          break;
        case HTTP_STATUS.FORBIDDEN:
          errorMessage = ERROR_MESSAGES.FORBIDDEN;
          break;
        case HTTP_STATUS.NOT_FOUND:
          errorMessage = ERROR_MESSAGES.NOT_FOUND;
          break;
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          errorMessage = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          errorMessage = responseData?.message || ERROR_MESSAGES.DEFAULT;
      }

      errorCode = responseData?.code || `HTTP_${status}`;
    }

    const apiError: ApiError = {
      message: errorMessage,
      code: errorCode,
      details: error.response?.data,
    };

    return {
      error: apiError,
      status: error.response?.status || 0,
      success: false,
    };
  }

  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async delete<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }

  async patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(endpoint, data, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error as AxiosError);
    }
  }
}