import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './DashboardSidebar.module.css';
import { useAuth, UserType } from '../../../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  roles?: UserType[];
}

interface DashboardSidebarProps {
  /**
   * Navigation items to display in the sidebar
   */
  navItems: NavItem[];
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * DashboardSidebar component for dashboard navigation
 */
const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  navItems,
  className,
}) => {
  const { user } = useAuth();
  
  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    
    return user && item.roles.includes(user.type);
  });
  
  // Combine class names
  const sidebarClasses = [
    styles.sidebar,
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={sidebarClasses}>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {filteredNavItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                <span className={styles.label}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
