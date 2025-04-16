import api from './api';
import { API_BASE_URL } from '../config/apiConfig';
import { SubscriptionPlan, SubscriptionData } from './userService';

// Subscription interfaces
export interface Subscription {
  id: string;
  memberId: number;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  nextBillingDate: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: Subscription | null;
}

export interface SubscriptionListResponse {
  success: boolean;
  message: string;
  data?: Subscription[] | null;
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message: string;
  data?: SubscriptionPlan[] | null;
}

/**
 * Get all available subscription plans
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlansResponse> => {
  try {
    // This will be replaced with an actual API call when Razorpay is integrated
    // For now, we'll return hardcoded plans
    const plans: SubscriptionPlan[] = [
      {
        id: 'common',
        name: 'Common',
        priceMonthly: 0,
        priceYearly: 0,
        features: [
          'Limited features',
          'Up to 10 customers',
          'Limited reporting and analytics'
        ],
        dishLimit: 5
      },
      {
        id: 'rare',
        name: 'Rare',
        priceMonthly: 99,
        priceYearly: 999,
        features: [
          'Basic features',
          'Up to 50 customers',
          'Limited reporting and analytics'
        ],
        dishLimit: 20
      },
      {
        id: 'epic',
        name: 'Epic',
        priceMonthly: 199,
        priceYearly: 1999,
        features: [
          'Advanced features',
          'Up to 200 customers',
          'Detailed reporting and analytics'
        ],
        dishLimit: 50
      },
      {
        id: 'legendary',
        name: 'Legendary',
        priceMonthly: 499,
        priceYearly: 4999,
        features: [
          'Comprehensive features',
          'Unlimited customers',
          'Advanced reporting and analytics'
        ],
        dishLimit: 0 // 0 means unlimited
      }
    ];

    return {
      success: true,
      message: 'Subscription plans retrieved successfully',
      data: plans
    };
  } catch (error) {
    let errorMessage = 'Error retrieving subscription plans';

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
 * Get the current member's subscription
 */
export const getCurrentSubscription = async (): Promise<SubscriptionResponse> => {
  try {
    const response = await api.get<Subscription>('/subscription/current', { withAuth: true });

    if (response.error) {
      throw response.error;
    }

    return {
      success: true,
      message: 'Subscription retrieved successfully',
      data: response.data
    };
  } catch (error) {
    let errorMessage = 'Error retrieving subscription';

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
 * Create a new subscription (will be used when Razorpay is integrated)
 */
export const createSubscription = async (subscriptionData: SubscriptionData): Promise<SubscriptionResponse> => {
  try {
    // This will be replaced with an actual API call when Razorpay is integrated
    // For now, we'll simulate a successful response
    const mockSubscription: Subscription = {
      id: 'sub_' + Math.random().toString(36).substring(2, 15),
      memberId: 1, // This would be the actual member ID
      planId: subscriptionData.plan,
      planName: subscriptionData.plan.charAt(0).toUpperCase() + subscriptionData.plan.slice(1),
      status: 'trial',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      autoRenew: true,
      billingCycle: subscriptionData.billingCycle,
      price: subscriptionData.plan === 'basic' ? 999 : subscriptionData.plan === 'professional' ? 2499 : 4999,
      nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
    };

    return {
      success: true,
      message: 'Subscription created successfully',
      data: mockSubscription
    };
  } catch (error) {
    let errorMessage = 'Error creating subscription';

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
 * Cancel a subscription
 */
export const cancelSubscription = async (subscriptionId: string): Promise<SubscriptionResponse> => {
  try {
    const response = await api.post<Subscription>(`/subscription/${subscriptionId}/cancel`, { withAuth: true });

    if (response.error) {
      throw response.error;
    }

    return {
      success: true,
      message: 'Subscription cancelled successfully',
      data: response.data
    };
  } catch (error) {
    let errorMessage = 'Error cancelling subscription';

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
 * Change subscription plan
 */
export const changeSubscriptionPlan = async (subscriptionId: string, newPlanId: string): Promise<SubscriptionResponse> => {
  try {
    const response = await api.post<Subscription>(`/subscription/${subscriptionId}/change-plan`, {
      withAuth: true,
      body: { planId: newPlanId }
    });

    if (response.error) {
      throw response.error;
    }

    return {
      success: true,
      message: 'Subscription plan changed successfully',
      data: response.data
    };
  } catch (error) {
    let errorMessage = 'Error changing subscription plan';

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
 * Change billing cycle (monthly/yearly)
 */
export const changeBillingCycle = async (subscriptionId: string, newCycle: 'monthly' | 'yearly'): Promise<SubscriptionResponse> => {
  try {
    const response = await api.post<Subscription>(`/subscription/${subscriptionId}/change-cycle`, {
      withAuth: true,
      body: { billingCycle: newCycle }
    });

    if (response.error) {
      throw response.error;
    }

    return {
      success: true,
      message: 'Billing cycle changed successfully',
      data: response.data
    };
  } catch (error) {
    let errorMessage = 'Error changing billing cycle';

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

// Export all methods as a single subscriptionService object
const subscriptionService = {
  getSubscriptionPlans,
  getCurrentSubscription,
  createSubscription,
  cancelSubscription,
  changeSubscriptionPlan,
  changeBillingCycle
};

export default subscriptionService;
