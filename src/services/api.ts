/**
 * API Service for making HTTP requests
 *
 * This service provides methods for making HTTP requests to the backend API.
 * It handles authentication, error handling, and response parsing.
 */

import { API_BASE_URL } from '../config/apiConfig';

// Request options interface
interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: any;
  withAuth?: boolean;
}

// Response interface
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

/**
 * Get the authentication token from local storage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Build the URL with query parameters
 */
const buildUrl = (endpoint: string, params?: Record<string, string | number | boolean>): string => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

/**
 * Build the request headers
 */
const buildHeaders = (options?: RequestOptions): Headers => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  // Add custom headers
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }

  // Add authentication token if required
  if (options?.withAuth) {
    const token = getAuthToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
  }

  return headers;
};

/**
 * Handle API errors
 */
const handleApiError = async (response: Response): Promise<Error> => {
  let errorMessage = 'An unexpected error occurred';

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch (error) {
    // If the response is not valid JSON, use the status text
    errorMessage = response.statusText || errorMessage;
  }

  return new Error(errorMessage);
};

/**
 * Make a GET request
 */
export const get = async <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  try {
    const url = buildUrl(endpoint, options?.params);
    const headers = buildHeaders(options);

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await handleApiError(response);
      return { data: null, error, status: response.status };
    }

    const data = await response.json();
    return { data, error: null, status: response.status };
  } catch (error) {
    return { data: null, error: error as Error, status: 0 };
  }
};

/**
 * Make a POST request
 */
export const post = async <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  try {
    const url = buildUrl(endpoint, options?.params);
    const headers = buildHeaders(options);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await handleApiError(response);
      return { data: null, error, status: response.status };
    }

    const data = await response.json();
    return { data, error: null, status: response.status };
  } catch (error) {
    return { data: null, error: error as Error, status: 0 };
  }
};

/**
 * Make a PUT request
 */
export const put = async <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  try {
    const url = buildUrl(endpoint, options?.params);
    const headers = buildHeaders(options);

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await handleApiError(response);
      return { data: null, error, status: response.status };
    }

    const data = await response.json();
    return { data, error: null, status: response.status };
  } catch (error) {
    return { data: null, error: error as Error, status: 0 };
  }
};

/**
 * Make a PATCH request
 */
export const patch = async <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  try {
    const url = buildUrl(endpoint, options?.params);
    const headers = buildHeaders(options);

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await handleApiError(response);
      return { data: null, error, status: response.status };
    }

    const data = await response.json();
    return { data, error: null, status: response.status };
  } catch (error) {
    return { data: null, error: error as Error, status: 0 };
  }
};

/**
 * Make a DELETE request
 */
export const del = async <T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
  try {
    const url = buildUrl(endpoint, options?.params);
    const headers = buildHeaders(options);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await handleApiError(response);
      return { data: null, error, status: response.status };
    }

    const data = await response.json();
    return { data, error: null, status: response.status };
  } catch (error) {
    return { data: null, error: error as Error, status: 0 };
  }
};

// Export all methods as a single API object
const api = {
  baseUrl: API_BASE_URL,
  get,
  post,
  put,
  patch,
  delete: del,
};

export default api;
