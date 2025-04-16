import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './MemberNavigation.module.css';
import { useAuth, UserType } from '../../../context/AuthContext';

const MemberNavigation: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get navigation links based on user role
  const getNavLinks = () => {
    if (!user) return [];

    switch (user.type) {
      case 'system-admin':
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/users', label: 'User Management' },
          { to: '/admin/dishes', label: 'Dish Approval' },
          { to: '/admin/reports', label: 'Reports' },
          { to: '/admin/settings', label: 'Settings' },
        ];
      case 'member':
        return [
          { to: '/member/dashboard', label: 'Dashboard' },
          { to: '/member/profile', label: 'Profile' },
          { to: '/add-dish', label: 'Add Dish' },
          { to: '/view-dish', label: 'View Dishes' },
        ];
      case 'customer':
        return [
          { to: '/customer/dashboard', label: 'Dashboard' },
          { to: '/customer/menu', label: 'Browse Menu' },
          { to: '/customer/orders', label: 'My Orders' },
          { to: '/customer/favorites', label: 'Favorites' },
          { to: '/customer/profile', label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className={styles.memberNavigation}>
      <ul>
        {navLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
        <li>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default MemberNavigation;

