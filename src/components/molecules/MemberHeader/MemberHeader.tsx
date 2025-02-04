import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MemberHeader.module.css';
import { logout } from '../../../services/logoutService';

const MemberHeader: React.FC = () => {
    const handleLogout = async () => {
        try {
            const response = await logout('admin'); // Specify 'admin' for admin logout
    
            if (response.message) {
                // Handle successful logout, e.g., redirect to login page
                window.location.href = '/login';
            } else {
                // Handle errors
                console.error('Logout failed:', response);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className={styles['member-header-container']}>
            <div className={styles['member-search-container']}>

            </div>
            <div className={styles['member-profile-section']}>
                <div className={styles['profile-dropdown']}>
                    <div className={styles['profile-dropdown-header']}>

                    </div>
                    <div className={styles['profile-dropdown-content']}>
                        <button onClick={handleLogout} className={styles['logout-button']}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemberHeader;

