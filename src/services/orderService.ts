import api from './api';

// Order interface
export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  date: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  deliveryTime?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  currentLocation?: string;
  cancellationReason?: string;
}

// Order item interface
export interface OrderItem {
  id: number;
  dishId: number;
  name: string;
  quantity: number;
  price: number;
}

// Create order request interface
export interface CreateOrderRequest {
  items: {
    dishId: number;
    quantity: number;
  }[];
  deliveryAddress: string;
  paymentMethod: string;
}

// Update order status request interface
export interface UpdateOrderStatusRequest {
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  cancellationReason?: string;
  currentLocation?: string;
  estimatedDelivery?: string;
}

/**
 * Get all orders for the current user
 */
export const getMyOrders = async (params?: { 
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders/me', { 
    withAuth: true,
    params: params as Record<string, string | number | boolean>
  });
  
  if (response.error) {
    console.error('Error fetching orders:', response.error);
    return [];
  }
  
  return response.data || [];
};

/**
 * Get an order by ID
 */
export const getOrderById = async (orderId: number): Promise<Order | null> => {
  const response = await api.get<Order>(`/orders/${orderId}`, { withAuth: true });
  
  if (response.error) {
    console.error(`Error fetching order ${orderId}:`, response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Create a new order
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<Order | null> => {
  const response = await api.post<Order>('/orders', { 
    withAuth: true,
    body: orderData
  });
  
  if (response.error) {
    console.error('Error creating order:', response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Update an order status
 */
export const updateOrderStatus = async (orderId: number, statusData: UpdateOrderStatusRequest): Promise<Order | null> => {
  const response = await api.patch<Order>(`/orders/${orderId}/status`, { 
    withAuth: true,
    body: statusData
  });
  
  if (response.error) {
    console.error(`Error updating order ${orderId} status:`, response.error);
    return null;
  }
  
  return response.data;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId: number, reason: string): Promise<boolean> => {
  const response = await api.post<{ success: boolean }>(`/orders/${orderId}/cancel`, { 
    withAuth: true,
    body: { reason }
  });
  
  if (response.error) {
    console.error(`Error cancelling order ${orderId}:`, response.error);
    return false;
  }
  
  return response.data?.success || false;
};

/**
 * Get order history statistics
 */
export const getOrderStats = async (): Promise<{
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  favoriteItems: number;
} | null> => {
  const response = await api.get<{
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    favoriteItems: number;
  }>('/orders/me/stats', { withAuth: true });
  
  if (response.error) {
    console.error('Error fetching order stats:', response.error);
    return null;
  }
  
  return response.data;
};

// Export all methods as a single orderService object
const orderService = {
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};

export default orderService;
