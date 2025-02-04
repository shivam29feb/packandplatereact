// src/services/logoutService.ts
import { API_BASE_URL } from '../config/apiConfig';

export const logout = async (userType: 'member' | 'admin'): Promise<{ message: string }> => {
    const endpoint = userType === 'admin' ? '/admin/logout.php' : '/logout.php';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include', // Include cookies for session management
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }

    return response.json();
};