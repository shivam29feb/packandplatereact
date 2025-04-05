import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../services/loginService';
import styles from './Login.module.css';

// Define user types for type safety
type UserType = 'admin' | 'member' | 'customer';

// Define the response type from login service
interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    type: UserType;
    // Add other user properties as needed
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'member' as UserType // Type assertion to ensure it's a valid UserType
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login(formData.email, formData.password, formData.userType) as LoginResponse;
      setMessage(response.message);
      
      if (response.success) {
        alert('Login successful');
        // Redirect based on user type
        const dashboardRoutes: Record<UserType, string> = {
          'admin': '/admin/dashboard',
          'member': '/member/dashboard',
          'customer': '/customer/dashboard'
        };
        
        // Use type assertion to ensure userType is valid
        const userType = (response.user?.type || 'member') as UserType;
        navigate(dashboardRoutes[userType]);
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      {message && <p className={message.includes('successful') ? styles.success : styles.error}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="userType">Login As</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={(e) => setFormData({...formData, userType: e.target.value as UserType})}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
  );
};

export default Login;


