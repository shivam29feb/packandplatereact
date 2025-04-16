import React from 'react';
import styles from './AdminDashboard.module.css';
import { useAuth } from '../../../../../context/AuthContext';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import MemberNavigation from '../../../../molecules/MemberNavigation/MemberNavigation';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Admin Dashboard"
      sidebarContent={<MemberNavigation />}
    >
      <div className={styles["admin-dashboard"]}>
        <div className={styles["dashboard-content"]}>
          <p>Welcome back, {user?.username || "Admin"}!</p>
          <p>This is the admin dashboard. You can manage users, dishes, and system settings from here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
