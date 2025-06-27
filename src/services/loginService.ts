import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Type guard to check if error is an Axios error
const isAxiosError = (error: unknown): error is { 
  isAxiosError: boolean; 
  response?: {
    status?: number;
    statusText?: string;
    data?: any;
  };
  request?: any;
  message: string;
} => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    type: string;
  };
}

interface LoginData {
  email: string;
  password: string;
  userType: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

type UserType = 'admin' | 'system-admin' | 'member' | 'customer';

export const login = async (email: string, password: string, userType: UserType = 'member'): Promise<LoginResponse> => {
  // Clear any existing auth data before login
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  sessionStorage.clear();

  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);
  formData.append('userType', userType);

  const url = `${API_BASE_URL}/src/config/auth/login.php`;

  console.log('=== Login Request ===');
  console.log('URL:', url);
  console.log('Email:', email, 'UserType:', userType);

  try {
    const response = await axios.post<LoginResponse>(
      url,
      formData,
      {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000
      }
    );

    console.log('=== Login Response ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (!response.data) {
      console.error('No response data received');
      return {
        success: false,
        message: 'No response data received from server'
      } as LoginResponse;
    }
    
    if (response.status >= 400) {
      const errorMessage = response.data?.message || `HTTP error! status: ${response.status}`;
      console.error('Login failed:', errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
    
    if (!response.data) {
      const errorMessage = 'No response data received';
      console.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('=== Login Error ===');
    
    if (isAxiosError(error)) {      
      if (error.response) {
        // Server responded with error status
        console.error('Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        return {
          success: false,
          message: error.response.data?.message || 
                 `HTTP error! status: ${error.response.status}`
        };
      } 
      
      if (error.request) {
        // No response received
        console.error('No response received:', error.request);
        return {
          success: false,
          message: 'No response from the server. Please check your connection.'
        };
      }
    }
    
    // Handle non-Axios errors
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
      
    console.error('Login error:', errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Logs out the current user by calling the logout API endpoint
 * @returns A promise that resolves to the logout response
 */
export const logout = async (): Promise<LogoutResponse> => {
  const url = `${API_BASE_URL}/src/config/auth/logout.php`;
  
  console.log('=== Logout Request ===');
  console.log('URL:', url);
  
  try {
    // Clear all auth-related data from localStorage and sessionStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();

    // Clear all cookies by setting them to expire in the past
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });

    // Make the logout request
    const response = await axios.post<LogoutResponse>(
      url,
      {},
      {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      }
    );

    console.log('=== Logout Response ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    // Clear any remaining auth data
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();

    if (response.status >= 400) {
      const errorMessage = response.data?.message || `HTTP error! status: ${response.status}`;
      console.error('Logout failed:', errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }

    if (!response.data) {
      const errorMessage = 'No response data received';
      console.error(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }

    // Force a hard refresh to clear any remaining state
    window.location.href = '/';
    window.location.reload();

    return response.data;
  } catch (error: unknown) {
    console.error('=== Logout Error ===');
    
    if (isAxiosError(error)) {      
      if (error.response) {
        console.error('Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        return {
          success: false,
          message: error.response.data?.message || 
                 `HTTP error! status: ${error.response.status}`
        };
      }
      
      if (error.request) {
        console.error('No response received:', error.request);
        return {
          success: false,
          message: 'No response from the server. Please check your connection.'
        };
      }
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred during logout';
      
    console.error('Logout error:', errorMessage);
    return {
      success: false,
      message: errorMessage
    };
  }
};

