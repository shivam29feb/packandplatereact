import React, { useState } from 'react';
import styles from './MemberProfile.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import ProfileForm from '../../../../organisms/ProfileForm/ProfileForm';
import Card, { CardHeader, CardContent } from '../../../../molecules/Card/Card';
import Typography from '../../../../atoms/Typography/Typography';
import Badge from '../../../../atoms/Badge/Badge';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../../../../molecules/Table/Table';
import { useAuth } from '../../../../../context/AuthContext';

// Sample member data
const sampleMemberData = {
  id: 1,
  username: 'johndoe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '(555) 123-4567',
  address: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345',
  country: 'USA',
  type: 'member' as const,
  bio: 'Professional chef with 10 years of experience in Italian cuisine.',
  joinDate: '2023-01-15',
};

// Sample dishes data
const sampleDishes = [
  {
    id: 1,
    name: 'Pasta Carbonara',
    category: 'Italian',
    status: 'approved',
    orders: 87,
    rating: 4.5,
    dateAdded: '2023-02-10'
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    category: 'Italian',
    status: 'approved',
    orders: 68,
    rating: 4.3,
    dateAdded: '2023-03-05'
  },
  {
    id: 3,
    name: 'Tiramisu',
    category: 'Italian',
    status: 'pending',
    orders: 0,
    rating: 0,
    dateAdded: '2023-05-15'
  },
  {
    id: 4,
    name: 'Chicken Parmesan',
    category: 'Italian',
    status: 'rejected',
    orders: 0,
    rating: 0,
    dateAdded: '2023-04-20'
  },
];

const MemberProfile: React.FC = () => {
  // State for member data
  const [memberData, setMemberData] = useState(sampleMemberData);
  const [dishes, setDishes] = useState(sampleDishes);

  // Get auth context
  const { user } = useAuth();

  // Navigation items for the sidebar
  const navItems = [
    { label: 'Dashboard', path: '/member/dashboard' },
    { label: 'My Dishes', path: '/member/dishes' },
    { label: 'Add New Dish', path: '/add-dish' },
    { label: 'Profile', path: '/member/profile' },
    { label: 'Settings', path: '/member/settings' },
  ];

  // Handle profile update
  const handleProfileUpdate = (updatedData: any) => {
    setMemberData(updatedData);
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
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
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
            userData={memberData}
            onSubmit={handleProfileUpdate}
            onPasswordChange={handlePasswordChange}
          />
        </div>

        <div className={styles.dishesSection}>
          <Card variant="elevated" className={styles.dishesCard}>
            <CardHeader
              title={<Typography variant="h6">My Dishes</Typography>}
            />
            <CardContent>
              <Table variant="striped">
                <TableHead>
                  <TableRow>
                    <TableCell header>Dish Name</TableCell>
                    <TableCell header>Category</TableCell>
                    <TableCell header>Status</TableCell>
                    <TableCell header align="right">Orders</TableCell>
                    <TableCell header align="right">Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dishes.map((dish) => (
                    <TableRow key={dish.id}>
                      <TableCell>{dish.name}</TableCell>
                      <TableCell>
                        <Badge variant="filled" color="secondary">{dish.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="filled"
                          color={getStatusBadgeColor(dish.status)}
                        >
                          {dish.status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">{dish.orders}</TableCell>
                      <TableCell align="right">
                        {dish.rating > 0 ? (
                          <span className={styles.rating}>
                            {dish.rating.toFixed(1)} ★
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card variant="elevated" className={styles.statsCard}>
            <CardHeader
              title={<Typography variant="h6">Performance Stats</Typography>}
            />
            <CardContent>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    {dishes.length}
                  </Typography>
                  <Typography variant="body2">Total Dishes</Typography>
                </div>

                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    {dishes.filter(dish => dish.status === 'approved').length}
                  </Typography>
                  <Typography variant="body2">Approved Dishes</Typography>
                </div>

                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    {dishes.reduce((sum, dish) => sum + dish.orders, 0)}
                  </Typography>
                  <Typography variant="body2">Total Orders</Typography>
                </div>

                <div className={styles.statItem}>
                  <Typography variant="h4" color="primary">
                    {dishes.some(dish => dish.rating > 0)
                      ? (dishes.reduce((sum, dish) => sum + dish.rating, 0) /
                         dishes.filter(dish => dish.rating > 0).length).toFixed(1) + ' ★'
                      : 'N/A'}
                  </Typography>
                  <Typography variant="body2">Average Rating</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberProfile;