import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

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

export const login = async (email: string, password: string, userType: string = 'member'): Promise<LoginResponse> => {
  try {
    const data: LoginData = {
      email,
      password,
      userType
    };

    const url = `${API_BASE_URL}/auth/login.php`;

    // Log complete request details
    console.log('=== Login Request Details ===');
    console.log('URL:', url);
    console.log('Data being sent:', data);
    console.log('API_BASE_URL:', API_BASE_URL);

    const response = await axios.post<LoginResponse>(
      url,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Log complete response
    console.log('=== Login Response Details ===');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);

    if (!response.data) {
      throw new Error('No response data received');
    }

    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('=== Login Error Details ===');
    let errorMessage = 'Error logging in';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: any;
        };
        message?: string;
      };

      console.error('Response Status:', axiosError.response?.status);
      console.error('Response Data:', axiosError.response?.data);
      errorMessage = axiosError.response?.data?.message || axiosError.message || errorMessage;
    } else if (error instanceof Error) {
      console.error('Error Message:', error.message);
      errorMessage = error.message;
    }

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
  try {
    const url = `${API_BASE_URL}/auth/logout.php`;

    console.log('=== Logout Request Details ===');
    console.log('URL:', url);

    const response = await axios.post<LogoutResponse>(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true // Important for sending cookies with the request
      }
    );

    console.log('=== Logout Response Details ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    return response.data;
  } catch (error) {
    console.error('=== Logout Error Details ===');
    let errorMessage = 'Error logging out';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: any;
        };
        message?: string;
      };

      console.error('Response Status:', axiosError.response?.status);
      console.error('Response Data:', axiosError.response?.data);
      errorMessage = axiosError.response?.data?.message || axiosError.message || errorMessage;
    } else if (error instanceof Error) {
      console.error('Error Message:', error.message);
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

