import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';
import { UserType } from '../types/userTypes';

export interface AdminLoginResponse {
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
}

export const adminLogin = async (email: string, password: string): Promise<AdminLoginResponse> => {
  try {
    const data: LoginData = { email, password };
    const url = `${API_BASE_URL}/admin/admin_login_api.php`;

    console.log('=== Admin Login Request ===');
    console.log('URL:', url);
    console.log('Data:', JSON.stringify(data, null, 2));

    const response = await axios.post<AdminLoginResponse>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    });

    console.log('=== Admin Login Response ===');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (!response.data) {
      throw new Error('No response data received');
    }

    // Map 'system-admin' to 'admin' for frontend consistency
    if (response.data.user) {
      response.data.user.type = response.data.user.type === 'system-admin' ? 'admin' : response.data.user.type;
    }

    return response.data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const adminLogout = async (): Promise<LogoutResponse> => {
  try {
    const response = await axios.post<LogoutResponse>(
      `${API_BASE_URL}/admin/logout.php`, 
      {},
      {
        withCredentials: true
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Admin logout error:', error);
    // Return a default error response
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to log out'
    };
  }
};
