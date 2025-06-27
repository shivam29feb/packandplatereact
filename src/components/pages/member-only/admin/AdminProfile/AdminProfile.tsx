import React from 'react';
import styles from './AdminProfile.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';

const AdminProfile: React.FC = () => {
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
      title="Admin Profile"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles['admin-profile']}>
        <h1>Admin Profile</h1>
        <p>Manage your admin profile settings here.</p>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
