import React, { useState } from 'react';
import styles from './CustomerProfile.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import ProfileForm from '../../../../organisms/ProfileForm/ProfileForm';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../../../../molecules/Table/Table';
import { useAuth } from '../../../../../context/AuthContext';

// Sample customer data
const sampleCustomerData = {
  id: 1,
  username: 'customer',
  email: 'customer@example.com',
  firstName: 'Customer',
  lastName: 'User',
  phone: '(555) 456-7890',
  address: '789 Customer Ave',
  city: 'Foodville',
  state: 'CA',
  zipCode: '67890',
  country: 'USA',
  type: 'customer' as const,
  bio: 'Food enthusiast who loves trying new dishes.',
  joinDate: '2023-02-15',
};

// Sample order history data
const sampleOrderHistory = [
  {
    id: 101,
    date: '2023-05-15',
    items: [
      { name: 'Pasta Carbonara', quantity: 2 },
      { name: 'Caesar Salad', quantity: 1 }
    ],
    total: 42.97,
    status: 'delivered'
  },
  {
    id: 102,
    date: '2023-05-10',
    items: [
      { name: 'Chicken Tikka Masala', quantity: 1 },
      { name: 'Greek Salad', quantity: 1 }
    ],
    total: 27.98,
    status: 'delivered'
  },
  {
    id: 103,
    date: '2023-05-05',
    items: [
      { name: 'Margherita Pizza', quantity: 2 },
      { name: 'Sushi Platter', quantity: 1 }
    ],
    total: 56.96,
    status: 'cancelled'
  },
];

// Sample payment methods
const samplePaymentMethods = [
  { id: 1, type: 'Credit Card', last4: '4242', expiry: '05/25', isDefault: true },
  { id: 2, type: 'PayPal', email: 'customer@example.com', isDefault: false },
];

const CustomerProfile: React.FC = () => {
  // State for customer data
  const [customerData, setCustomerData] = useState(sampleCustomerData);
  const [orderHistory, setOrderHistory] = useState(sampleOrderHistory);
  const [paymentMethods, setPaymentMethods] = useState(samplePaymentMethods);

  // Get auth context
  const { user } = useAuth();

  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/customer/dashboard' },
    { label: 'Browse Menu', path: '/customer/menu' },
    { label: 'My Orders', path: '/customer/orders' },
    { label: 'Favorites', path: '/customer/favorites' },
    { label: 'Profile', path: '/customer/profile' },
  ];

  // Handle profile update
  const handleProfileUpdate = (updatedData: any) => {
    setCustomerData(updatedData);
    // In a real app, this would send the updated data to the server
    alert('Profile updated successfully!');
  };

  // Handle password change
  const handlePasswordChange = (oldPassword: string, newPassword: string) => {
    // In a real app, this would send the password change request to the server
    alert('Password changed successfully!');
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'processing':
      case 'in-transit':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <DashboardLayout
      title="My Profile"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles.profileContainer}>
        <div className={styles.profileSection}>
          <ProfileForm
            userData={customerData}
            onSubmit={handleProfileUpdate}
            onPasswordChange={handlePasswordChange}
          />
        </div>

        <div className={styles.infoSection}>
          <Card variant="elevated" className={styles.ordersCard}>
            <CardHeader
              title={<Typography variant="h6">Recent Orders</Typography>}
              action={
                <div
                  className={styles.viewAllLink}
                  onClick={() => window.location.href = '/customer/orders'}
                >
                  <Typography
                    variant="body2"
                    color="primary"
                  >
                    View All
                  </Typography>
                </div>
              }
            />
            <CardContent>
              <Table variant="striped">
                <TableHead>
                  <TableRow>
                    <TableCell header>Order ID</TableCell>
                    <TableCell header>Date</TableCell>
                    <TableCell header>Total</TableCell>
                    <TableCell header>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="filled"
                          color={getStatusBadgeColor(order.status)}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card variant="elevated" className={styles.paymentCard}>
            <CardHeader
              title={<Typography variant="h6">Payment Methods</Typography>}
              action={
                <div
                  className={styles.addPaymentLink}
                  onClick={() => alert('Add payment method functionality would go here')}
                >
                  <Typography
                    variant="body2"
                    color="primary"
                  >
                    Add New
                  </Typography>
                </div>
              }
            />
            <CardContent>
              <div className={styles.paymentMethodsList}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className={styles.paymentMethodItem}>
                    <div className={styles.paymentMethodInfo}>
                      <Typography variant="body1" className={styles.paymentMethodType}>
                        {method.type}
                      </Typography>
                      <Typography variant="body2" color="secondary">
                        {method.type === 'Credit Card'
                          ? `**** **** **** ${method.last4} (Expires: ${method.expiry})`
                          : method.email}
                      </Typography>
                    </div>
                    <div className={styles.paymentMethodActions}>
                      {method.isDefault && (
                        <Badge variant="filled" color="primary">Default</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className={styles.statsCard}>
            <CardHeader
              title={<Typography variant="h6">Account Statistics</Typography>}
            />
            <CardContent>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    {orderHistory.length}
                  </Typography>
                  <Typography variant="body2">Total Orders</Typography>
                </div>

                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    ${orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2">Total Spent</Typography>
                </div>

                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    3
                  </Typography>
                  <Typography variant="body2">Favorite Items</Typography>
                </div>

                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    ${(orderHistory.reduce((sum, order) => sum + order.total, 0) /
                       orderHistory.length).toFixed(2)}
                  </Typography>
                  <Typography variant="body2">Avg. Order Value</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerProfile;
