import api from './api';
import { API_BASE_URL } from '../config/apiConfig';

// Dish interface
export interface Dish {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  memberId: number;
  memberName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  rating?: number;
  reviews?: Review[];
}

// Review interface
export interface Review {
  id: number;
  dishId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Create dish request interface
export interface CreateDishRequest {
  name: string;
  category: string;
  price: number;
  description: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Update dish request interface
export interface UpdateDishRequest {
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Dish approval request interface
export interface DishApprovalRequest {
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}

/**
 * Get all dishes
 */
export const getAllDishes = async (params?: { 
  category?: string; 
  status?: string;
  memberId?: number;
  page?: number;
  limit?: number;
}): Promise<Dish[]> => {
  const response = await api.get<Dish[]>('/dishes', { 
    withAuth: true,
    params: params as Record<string, string | number | boolean>
  });
  
  if (response.error) {
    console.error('Error fetching dishes:', response.error);
    return [];
  }
  
  return response.data || [];
};

/**
 * Get a dish by ID
 */
export const getDishById = async (dishId: number): Promise<Dish | null> => {
  const response = await api.get<Dish>(`/dishes/${dishId}`, { withAuth: true });
  
  if (response.error) {
    console.error(`Error fetching dish ${dishId}:`, response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Create a new dish
 */
export const createDish = async (dishData: CreateDishRequest): Promise<Dish | null> => {
  const response = await api.post<Dish>('/dishes', { 
    withAuth: true,
    body: dishData
  });
  
  if (response.error) {
    console.error('Error creating dish:', response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Update a dish
 */
export const updateDish = async (dishId: number, dishData: UpdateDishRequest): Promise<Dish | null> => {
  const response = await api.patch<Dish>(`/dishes/${dishId}`, { 
    withAuth: true,
    body: dishData
  });
  
  if (response.error) {
    console.error(`Error updating dish ${dishId}:`, response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Delete a dish
 */
export const deleteDish = async (dishId: number): Promise<boolean> => {
  const response = await api.delete<{ success: boolean }>(`/dishes/${dishId}`, { withAuth: true });
  
  if (response.error) {
    console.error(`Error deleting dish ${dishId}:`, response.error);
    return false;
  }
  
  return response.data?.success || false;
};

/**
 * Upload a dish image
 */
export const uploadDishImage = async (dishId: number, file: File): Promise<string | null> => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('image', file);
  
  // Use the fetch API directly for file uploads
  try {
    const response = await fetch(`${API_BASE_URL}/dishes/${dishId}/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload dish image');
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading dish image:', error);
    return null;
  }
};

/**
 * Approve or reject a dish
 */
export const approveDish = async (dishId: number, approvalData: DishApprovalRequest): Promise<Dish | null> => {
  const response = await api.post<Dish>(`/dishes/${dishId}/approval`, { 
    withAuth: true,
    body: approvalData
  });
  
  if (response.error) {
    console.error(`Error approving/rejecting dish ${dishId}:`, response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Add a review to a dish
 */
export const addReview = async (dishId: number, rating: number, comment: string): Promise<Review | null> => {
  const response = await api.post<Review>(`/dishes/${dishId}/reviews`, { 
    withAuth: true,
    body: { rating, comment }
  });
  
  if (response.error) {
    console.error(`Error adding review to dish ${dishId}:`, response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Get reviews for a dish
 */
export const getDishReviews = async (dishId: number): Promise<Review[]> => {
  const response = await api.get<Review[]>(`/dishes/${dishId}/reviews`, { withAuth: true });
  
  if (response.error) {
    console.error(`Error fetching reviews for dish ${dishId}:`, response.error);
    return [];
  }
  
  return response.data || [];
};

// Export all methods as a single dishService object
const dishService = {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  uploadDishImage,
  approveDish,
  addReview,
  getDishReviews,
};

export default dishService;
