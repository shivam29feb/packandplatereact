import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import { useAuth } from '../../../../../context/AuthContext';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Button from '../../../../atoms/Button/Button';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../../../../molecules/Table/Table';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Navigation items for admin sidebar
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  // Sample data for the dashboard
  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'member', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'member', status: 'pending' },
  ];

  const systemStats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Active Members', value: '856', change: '+5%' },
    { label: 'Total Dishes', value: '2,345', change: '+8%' },
    { label: 'Monthly Orders', value: '1,234', change: '+15%' },
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
      actions={
        <Button
          variant="secondary"
          size="small"
          onClick={() => {}}
        >
          Generate Report
        </Button>
      }
    >
      <div className={styles.dashboardContent}>
        <div className={styles.welcomeSection}>
          <Typography variant="h4" component="h1">Welcome back, {user?.username || 'Admin'}!</Typography>
          <Typography variant="body2" color="secondary">
            Here's what's happening with your platform today.
          </Typography>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {systemStats.map((stat, index) => (
            <Card key={index} variant="elevated" className={styles.statCard}>
              <CardContent>
                <Typography variant="body2" color="secondary">{stat.label}</Typography>
                <div className={styles.statValueContainer}>
                  <Typography variant="h4">{stat.value}</Typography>
                  <Badge 
                    color={stat.change.startsWith('+') ? 'success' : 'error'}
                    variant="filled"
                    size="small"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card variant="elevated" className={styles.quickActionsCard}>
          <CardHeader title="Quick Actions" />
          <CardContent>
            <div className={styles.quickActionsGrid}>
              <Link to="/admin/users" className={styles.quickAction}>
                <div className={styles.quickActionIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <Typography variant="subtitle2">Manage Users</Typography>
              </Link>
              <Link to="/admin/users" className={styles.quickAction}>
                <div className={styles.quickActionIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <Typography variant="subtitle2">Add New Admin</Typography>
              </Link>
              <Link to="/admin/reports" className={styles.quickAction}>
                <div className={styles.quickActionIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <Typography variant="subtitle2">View Reports</Typography>
              </Link>
              <Link to="/admin/settings" className={styles.quickAction}>
                <div className={styles.quickActionIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.4.7.4 1.5 0 2.2V12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1z"></path>
                  </svg>
                </div>
                <Typography variant="subtitle2">System Settings</Typography>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users Table */}
        <Card variant="elevated" className={styles.tableCard}>
          <CardHeader title="Recent Users" />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        variant="filled"
                        size="small"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        color={user.status === 'active' ? 'success' : 'warning'}
                        variant="filled"
                        size="small"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="ghost" 
                        size="small"
                        className={styles.viewButton}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <Card variant="outlined">
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className={styles.actionButtons}>
                <Link to="/admin/users" className={styles.actionLink}>
                  <Button variant="secondary" fullWidth>Manage Users</Button>
                </Link>
                <Link to="/admin/reports" className={styles.actionLink}>
                  <Button variant="secondary" fullWidth>View Reports</Button>
                </Link>
                <Link to="/admin/settings" className={styles.actionLink}>
                  <Button variant="secondary" fullWidth>System Settings</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
