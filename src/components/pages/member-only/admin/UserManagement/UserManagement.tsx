import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserManagement.module.css';
import DashboardLayout from '../../../../templates/DashboardLayout/DashboardLayout';
import DashboardSidebar from '../../../../organisms/DashboardSidebar/DashboardSidebar';
import Button from '../../../../atoms/Button/Button';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'member' | 'customer';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as const,
  });
  const navigate = useNavigate();

  // Navigation items for admin sidebar
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'User Management', path: '/admin/users' },
    { label: 'Dish Approval', path: '/admin/dishes' },
    { label: 'Reports', path: '/admin/reports' },
    { label: 'Settings', path: '/admin/settings' },
  ];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // Mock data for now
        setTimeout(() => {
          setUsers([
            {
              id: '1',
              username: 'admin1',
              email: 'admin1@example.com',
              role: 'admin',
              isActive: true,
              lastLogin: '2023-06-13T10:30:00Z',
              createdAt: '2023-01-15T09:30:00Z',
            },
            {
              id: '2',
              username: 'admin2',
              email: 'admin2@example.com',
              role: 'admin',
              isActive: true,
              lastLogin: '2023-06-12T15:45:00Z',
              createdAt: '2023-02-20T14:15:00Z',
            },
          ]);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch users');
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('All fields are required');
      return;
    }

    try {
      // Replace with actual API call
      // const response = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newUser)
      // });
      // const data = await response.json();
      
      // Mock success response
      setTimeout(() => {
        const createdUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        
        setUsers(prev => [createdUser, ...prev]);
        setNewUser({
          username: '',
          email: '',
          password: '',
          role: 'admin',
        });
        setShowCreateForm(false);
        setError('');
      }, 500);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Replace with actual API call
      // await fetch(`/api/admin/users/${userId}/status`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ isActive: !currentStatus })
      // });
      
      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        )
      );
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      // Replace with actual API call
      // await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      
      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardLayout
      title="User Management"
      sidebarContent={<DashboardSidebar navItems={navItems} />}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Admin Users</h1>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant="primary"
          >
            {showCreateForm ? 'Cancel' : 'Add New Admin'}
          </Button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {showCreateForm && (
          <form onSubmit={handleCreateUser} className={styles.userForm}>
            <h3>Create New Admin</h3>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                Create Admin
              </Button>
            </div>
          </form>
        )}

        <div className={styles.tableContainer}>
          {isLoading ? (
            <div className={styles.loading}>Loading users...</div>
          ) : (
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.noUsers}>
                      No admin users found
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td className={styles.actionsCell}>
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="secondary"
                          severity="danger"
                          size="small"
                          onClick={() => deleteUser(user.id)}
                          className={styles.deleteButton}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
