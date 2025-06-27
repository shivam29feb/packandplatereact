import React from 'react';
import styles from './AdminSettings.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';

const AdminSettings: React.FC = () => {
  // Navigation items for admin sidebar
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Dish Approval', path: '/admin/dishes' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <DashboardLayout
      title="Admin Settings"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles['admin-settings']}>
        <h1>Admin Settings</h1>
        <p>Configure system settings and preferences.</p>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
