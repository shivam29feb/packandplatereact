import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

interface SignupResponse {
  success: boolean;
  message: string;
  userId?: number;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export const signup = async (username: string, email: string, password: string): Promise<SignupResponse> => {
  try {
    const data: SignupData = {
      username,
      email,
      password
    };

    const url = `${API_BASE_URL}/member/signup_api.php`;
    
    // Log complete request details
    console.log('=== Signup Request Details ===');
    console.log('URL:', url);
    console.log('Data being sent:', data);
    console.log('API_BASE_URL:', API_BASE_URL);

    const response = await axios.post<SignupResponse>(
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
    console.log('=== Signup Response Details ===');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);

    if (!response.data) {
      throw new Error('No response data received');
    }

    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error('=== Signup Error Details ===');
    let errorMessage = 'Error signing up';
    
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
