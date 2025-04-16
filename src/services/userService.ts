import api from './api';
import { UserType } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig';

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  type: UserType;
  avatar?: string;
  bio?: string;
  joinDate: string;
}

// Subscription interfaces
export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  dishLimit: number;
}

export interface SubscriptionData {
  plan: string;
  billingCycle: 'monthly' | 'yearly';
}

// Signup interfaces
interface SignupResponse {
  success: boolean;
  message: string;
  userId?: number;
  subscriptionId?: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  userType?: string;
  businessName?: string;
  phone?: string;
  address?: string;
  subscription?: {
    plan: string;
    billingCycle: string;
  };
}

// Login interfaces
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface LoginData {
  email: string;
  password: string;
}

// Update user profile interface
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  bio?: string;
}

// Change password interface
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Sign up a new user
 */
export const signup = async (
  username: string,
  email: string,
  password: string,
  userType: string = 'customer',
  additionalData?: {
    phone?: string;
    address?: string;
    businessName?: string;
    plan?: string;
    billingCycle?: string;
  }
): Promise<SignupResponse> => {
  try {
    const data: SignupData = {
      username,
      email,
      password,
      userType
    };

    // Add additional data if provided
    if (additionalData) {
      if (additionalData.phone) data.phone = additionalData.phone;
      if (additionalData.address) data.address = additionalData.address;
      if (additionalData.businessName) data.businessName = additionalData.businessName;

      // Add subscription data if provided
      if (additionalData.plan && additionalData.billingCycle) {
        data.subscription = {
          plan: additionalData.plan,
          billingCycle: additionalData.billingCycle
        };
      }
    }

    // Use the auth/register endpoint for all user types
    const url = `${API_BASE_URL}/auth/register.php`;

    // Log complete request details
    console.log('=== Signup Request Details ===');
    console.log('URL:', url);
    console.log('Data being sent:', data);
    console.log('API_BASE_URL:', API_BASE_URL);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // Log complete response
    console.log('=== Signup Response Details ===');
    console.log('Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Data:', responseData);

    if (!responseData) {
      throw new Error('No response data received');
    }

    return responseData;
  } catch (error) {
    // Enhanced error logging
    console.error('=== Signup Error Details ===');
    let errorMessage = 'Error signing up';

    if (error instanceof Error) {
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
 * Log in a user
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const data: LoginData = {
      email,
      password
    };

    const url = `${API_BASE_URL}/auth/login`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    if (!responseData) {
      throw new Error('No response data received');
    }

    // Store the token in local storage if login was successful
    if (responseData.success && responseData.token) {
      localStorage.setItem('auth_token', responseData.token);
    }

    return responseData;
  } catch (error) {
    let errorMessage = 'Error logging in';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Log out the current user
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Get the current user's profile
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const response = await api.get<User>('/users/me', { withAuth: true });

  if (response.error) {
    console.error('Error fetching current user:', response.error);
    return null;
  }

  return response.data;
};

/**
 * Get a user by ID
 */
export const getUserById = async (userId: number): Promise<User | null> => {
  const response = await api.get<User>(`/users/${userId}`, { withAuth: true });

  if (response.error) {
    console.error(`Error fetching user ${userId}:`, response.error);
    return null;
  }

  return response.data;
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (profileData: UpdateUserProfileRequest): Promise<User | null> => {
  const response = await api.patch<User>('/users/me', {
    withAuth: true,
    body: profileData
  });

  if (response.error) {
    console.error('Error updating user profile:', response.error);
    return null;
  }

  return response.data;
};

/**
 * Change the current user's password
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<boolean> => {
  const response = await api.post<{ success: boolean }>('/users/me/change-password', {
    withAuth: true,
    body: passwordData
  });

  if (response.error) {
    console.error('Error changing password:', response.error);
    return false;
  }

  return response.data?.success || false;
};

/**
 * Delete the current user's account
 */
export const deleteAccount = async (): Promise<boolean> => {
  const response = await api.delete<{ success: boolean }>('/users/me', { withAuth: true });

  if (response.error) {
    console.error('Error deleting account:', response.error);
    return false;
  }

  return response.data?.success || false;
};

// Export all methods as a single userService object
const userService = {
  signup,
  login,
  logout,
  getCurrentUser,
  getUserById,
  updateUserProfile,
  changePassword,
  deleteAccount,
};

export default userService;
