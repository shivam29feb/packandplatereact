import React from 'react';
import styles from './Reports.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';

const Reports: React.FC = () => {
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
      title="Reports"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles['reports']}>
        <h1>Reports</h1>
        <p>View and generate system reports.</p>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
