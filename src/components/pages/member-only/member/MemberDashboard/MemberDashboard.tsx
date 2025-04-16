import React from 'react';
import styles from './MemberDashboard.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Button from '../../../../atoms/Button/Button';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Tabs, { Tab, TabPanel } from '../../../../molecules/Tabs/Tabs';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../../../../molecules/Table/Table';
import { Link } from 'react-router-dom';

const MemberDashboard: React.FC = () => {
  // Sample data for the dashboard
  const recentDishes = [
    { id: 1, name: 'Pasta Carbonara', category: 'Italian', status: 'active' },
    { id: 2, name: 'Chicken Tikka Masala', category: 'Indian', status: 'pending' },
    { id: 3, name: 'Caesar Salad', category: 'American', status: 'active' },
  ];

  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/member/dashboard' },
    { label: 'My Dishes', path: '/member/dishes' },
    { label: 'Add New Dish', path: '/add-dish' },
    { label: 'Profile', path: '/member/profile' },
    { label: 'Settings', path: '/member/settings' },
  ];

  return (
    <DashboardLayout
      title="Member Dashboard"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
      actions={
        <Button
          variant="primary"
          size="small"
          onClick={() => {}}
        >
          Add New Dish
        </Button>
      }
    >
      <div className={styles.dashboardContent}>
        <div className={styles.statsRow}>
          <Card variant="elevated" className={styles.statCard}>
            <CardContent>
              <Typography variant="h4" color="primary">12</Typography>
              <Typography variant="body2">Total Dishes</Typography>
            </CardContent>
          </Card>

          <Card variant="elevated" className={styles.statCard}>
            <CardContent>
              <Typography variant="h4" color="primary">8</Typography>
              <Typography variant="body2">Active Dishes</Typography>
            </CardContent>
          </Card>

          <Card variant="elevated" className={styles.statCard}>
            <CardContent>
              <Typography variant="h4" color="primary">4</Typography>
              <Typography variant="body2">Pending Dishes</Typography>
            </CardContent>
          </Card>
        </div>

        <div className={styles.mainContent}>
          <Card variant="elevated" className={styles.recentDishesCard}>
            <CardHeader
              title={<Typography variant="h6">Recent Dishes</Typography>}
              action={
                <Link to="/member/dishes">
                  <Button variant="ghost" size="small">View All</Button>
                </Link>
              }
            />
            <CardContent>
              <Table variant="striped" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell header>Name</TableCell>
                    <TableCell header>Category</TableCell>
                    <TableCell header>Status</TableCell>
                    <TableCell header align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentDishes.map((dish) => (
                    <TableRow key={dish.id}>
                      <TableCell>{dish.name}</TableCell>
                      <TableCell>{dish.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant="filled"
                          color={dish.status === 'active' ? 'success' : 'warning'}
                        >
                          {dish.status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <Link to={`/member/view-dish/${dish.id}`}>
                          <Button variant="ghost" size="small">View</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card variant="elevated" className={styles.activityCard}>
            <CardHeader
              title={<Typography variant="h6">Activity</Typography>}
            />
            <CardContent>
              <Tabs variant="standard">
                <Tab label="Recent" />
                <Tab label="Comments" />
                <Tab label="Updates" />

                <TabPanel>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <Typography variant="body2" color="secondary">Today</Typography>
                      <Typography variant="body1">You added a new dish: Pasta Carbonara</Typography>
                    </div>
                    <div className={styles.activityItem}>
                      <Typography variant="body2" color="secondary">Yesterday</Typography>
                      <Typography variant="body1">Your dish "Chicken Tikka Masala" is pending approval</Typography>
                    </div>
                    <div className={styles.activityItem}>
                      <Typography variant="body2" color="secondary">3 days ago</Typography>
                      <Typography variant="body1">You updated your profile information</Typography>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <Typography variant="body2" color="secondary">2 days ago</Typography>
                      <Typography variant="body1">Admin commented on your dish "Caesar Salad"</Typography>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <Typography variant="body2" color="secondary">1 week ago</Typography>
                      <Typography variant="body1">System update: New features added to the platform</Typography>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDashboard;