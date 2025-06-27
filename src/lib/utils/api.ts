/**
 * API utility functions for making authenticated requests
 */

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Get the stored token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create full API URL
const createApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Create headers with authorization token
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Authenticated fetch wrapper
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const authHeaders = createAuthHeaders();
  const fullUrl = createApiUrl(url);
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(fullUrl, config);
  
  // Handle unauthorized responses
  if (response.status === 401) {
    // Token might be expired, clear it
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    // Redirect to login
    window.location.href = '/auth/login';
    throw new Error('Authentication required');
  }
  
  return response;
};

// Convenience methods for common HTTP verbs
export const api = {
  get: (url: string) => authenticatedFetch(url, { method: 'GET' }),
  
  post: (url: string, data: any) => authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (url: string, data: any) => authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (url: string) => authenticatedFetch(url, { method: 'DELETE' }),
};

// Admin-specific API calls
export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),
  getStats: () => api.get('/api/admin/stats'),
  getContent: () => api.get('/api/admin/content'),
  createUser: (userData: any) => api.post('/api/admin/users', userData),
  updateUser: (userId: string, userData: any) => api.put('/api/admin/users', { userId, ...userData }),
  deleteUser: (userId: string) => api.delete(`/api/admin/users/${userId}`),
};
