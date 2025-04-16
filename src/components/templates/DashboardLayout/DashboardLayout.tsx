import React, { useState } from 'react';
import styles from './DashboardLayout.module.css';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../atoms/Button/Button';
import Avatar from '../../atoms/Avatar/Avatar';

interface DashboardLayoutProps {
  /**
   * The content of the dashboard
   */
  children: React.ReactNode;
  
  /**
   * The title of the dashboard
   */
  title: string;
  
  /**
   * Optional actions to display in the header
   */
  actions?: React.ReactNode;
  
  /**
   * Optional sidebar content
   */
  sidebarContent?: React.ReactNode;
  
  /**
   * Whether the sidebar is open by default on mobile
   * @default false
   */
  defaultSidebarOpen?: boolean;
}

/**
 * DashboardLayout component for creating a consistent dashboard layout
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  actions,
  sidebarContent,
  defaultSidebarOpen = false,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={styles.dashboardLayout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {sidebarContent && (
            <button 
              className={styles.menuButton} 
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <span className={styles.menuIcon}></span>
            </button>
          )}
          <h1 className={styles.title}>{title}</h1>
        </div>
        
        <div className={styles.headerRight}>
          {actions && <div className={styles.actions}>{actions}</div>}
          
          <div className={styles.userMenu}>
            <Avatar 
              size="small"
              variant="circular"
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <span className={styles.username}>{user?.username || 'User'}</span>
            <Button 
              variant="ghost" 
              size="small" 
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className={styles.container}>
        {sidebarContent && (
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
            {sidebarContent}
          </aside>
        )}
        
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
