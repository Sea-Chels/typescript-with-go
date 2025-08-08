// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const ENV = import.meta.env.VITE_ENV || 'development';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  STUDENTS: {
    LIST: '/students',
    CREATE: '/students',
    GET: (id: number) => `/students/${id}`,
    UPDATE: (id: number) => `/students/${id}`,
    DELETE: (id: number) => `/students/${id}`,
  },
  HEALTH: '/health',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Routes
export const ROUTES = {
  LOGIN: '/login',
  STUDENTS: '/students',
  HOME: '/',
};