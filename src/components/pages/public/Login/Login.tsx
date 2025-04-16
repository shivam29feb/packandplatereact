import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth, UserType } from '../../../../context/AuthContext';
import LoginForm from '../../../organisms/LoginForm/LoginForm';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Typography from '../../../atoms/Typography/Typography';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoutes: Record<UserType, string> = {
        'admin': '/admin/dashboard',
        'system-admin': '/admin/dashboard',
        'member': '/member/dashboard',
        'customer': '/customer/dashboard'
      };

      // Redirect to the appropriate dashboard
      const from = location.state?.from?.pathname || dashboardRoutes[user.type];
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLoginSuccess = () => {
    // Additional success handling if needed
    console.log('Login successful');
  };

  const handleLoginError = (error: string) => {
    // Additional error handling if needed
    console.error('Login error:', error);
  };

  return (
    <div className={styles.pageContainer}>
      <PublicNavigation />

      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <Typography variant="h3" align="center" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="secondary">
            Sign in to continue to your account
          </Typography>
        </div>

        <LoginForm
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </div>
  );
};

export default Login;



