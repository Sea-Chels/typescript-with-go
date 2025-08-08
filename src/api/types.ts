// API Response Types

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_at: string;
}

// Student Types
export interface Student {
  id: number;
  name: string;
  grade: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface StudentsResponse {
  students: Student[];
  count: number;
}

export interface CreateStudentRequest {
  name: string;
  grade: number;
}

// Health Check
export interface HealthResponse {
  status: string;
  timestamp: string;
}