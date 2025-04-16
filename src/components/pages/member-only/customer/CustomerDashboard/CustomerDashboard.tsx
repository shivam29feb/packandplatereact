import React from 'react';
import styles from './CustomerDashboard.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Button from '../../../../atoms/Button/Button';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Tabs, { Tab, TabPanel } from '../../../../molecules/Tabs/Tabs';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../../../../molecules/Table/Table';
import { Link } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  // Sample data for the dashboard
  const favoriteItems = [
    { id: 1, name: 'Pasta Carbonara', category: 'Italian', price: '$12.99' },
    { id: 2, name: 'Chicken Tikka Masala', category: 'Indian', price: '$14.99' },
    { id: 3, name: 'Caesar Salad', category: 'American', price: '$9.99' },
  ];
  
  const recentOrders = [
    { id: 101, date: '2023-05-15', items: 3, total: '$42.97', status: 'delivered' },
    { id: 102, date: '2023-05-10', items: 2, total: '$27.98', status: 'delivered' },
    { id: 103, date: '2023-05-05', items: 4, total: '$56.96', status: 'cancelled' },
  ];
  
  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard' },
    { label: 'Browse Menu', path: '/customer/menu' },
    { label: 'My Orders', path: '/customer/orders' },
    { label: 'Favorites', path: '/customer/favorites' },
    { label: 'Profile', path: '/customer/profile' },
  ];
  
  return (
    <DashboardLayout
      title="Customer Dashboard"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
      actions={
        <Button 
          variant="primary" 
          size="small"
          onClick={() => {}}
        >
          Order Now
        </Button>
      }
    >
      <div className={styles.dashboardContent}>
        <div className={styles.welcomeSection}>
          <Card variant="elevated" className={styles.welcomeCard}>
            <CardContent>
              <div className={styles.welcomeContent}>
                <div>
                  <Typography variant="h4">Welcome back!</Typography>
                  <Typography variant="body1">Explore our menu and place your order today.</Typography>
                </div>
                <Button variant="primary">Browse Menu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className={styles.statsRow}>
          <Card variant="elevated" className={styles.statCard}>
            <CardContent>
              <Typography variant="h4" color="primary">5</Typography>
              <Typography variant="body2">Total Orders</Typography>
            </CardContent>
          </Card>
          
          <Card variant="elevated" className={styles.statCard}>
            <CardContent>
              <Typography variant="h4" color="primary">3</Typography>
              <Typography variant="body2">Favorite Items</Typography>
            </CardContent>
          </Card>
          
          <Card variant="elevated" className={styles.statCard}>
            <CardContent>
              <Typography variant="h4" color="primary">$127.91</Typography>
              <Typography variant="body2">Total Spent</Typography>
            </CardContent>
          </Card>
        </div>
        
        <div className={styles.mainContent}>
          <Card variant="elevated" className={styles.ordersCard}>
            <CardHeader 
              title={<Typography variant="h6">Recent Orders</Typography>}
              action={
                <Link to="/customer/orders">
                  <Button variant="ghost" size="small">View All</Button>
                </Link>
              }
            />
            <CardContent>
              <Table variant="striped" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell header>Order ID</TableCell>
                    <TableCell header>Date</TableCell>
                    <TableCell header>Items</TableCell>
                    <TableCell header>Total</TableCell>
                    <TableCell header>Status</TableCell>
                    <TableCell header align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="filled" 
                          color={order.status === 'delivered' ? 'success' : 'error'}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="ghost" size="small">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className={styles.sideSection}>
            <Card variant="elevated" className={styles.favoritesCard}>
              <CardHeader 
                title={<Typography variant="h6">Favorite Items</Typography>}
                action={
                  <Link to="/customer/favorites">
                    <Button variant="ghost" size="small">View All</Button>
                  </Link>
                }
              />
              <CardContent>
                <div className={styles.favoritesList}>
                  {favoriteItems.map((item) => (
                    <div key={item.id} className={styles.favoriteItem}>
                      <div className={styles.favoriteInfo}>
                        <Typography variant="body1" className={styles.favoriteName}>{item.name}</Typography>
                        <Typography variant="body2" color="secondary">{item.category}</Typography>
                        <Typography variant="body2">{item.price}</Typography>
                      </div>
                      <Button variant="secondary" size="small">Order</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card variant="elevated" className={styles.recommendationsCard}>
              <CardHeader 
                title={<Typography variant="h6">Recommended For You</Typography>}
              />
              <CardContent>
                <div className={styles.recommendationsList}>
                  <div className={styles.recommendationItem}>
                    <div className={styles.recommendationInfo}>
                      <Typography variant="body1">Margherita Pizza</Typography>
                      <Typography variant="body2" color="secondary">Italian</Typography>
                      <Typography variant="body2">$11.99</Typography>
                    </div>
                    <Button variant="secondary" size="small">Add</Button>
                  </div>
                  <div className={styles.recommendationItem}>
                    <div className={styles.recommendationInfo}>
                      <Typography variant="body1">Beef Burger</Typography>
                      <Typography variant="body2" color="secondary">American</Typography>
                      <Typography variant="body2">$10.99</Typography>
                    </div>
                    <Button variant="secondary" size="small">Add</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
