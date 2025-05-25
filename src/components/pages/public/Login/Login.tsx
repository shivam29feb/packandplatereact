import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../../../../context/AuthContext';
import LoginForm from '../../../organisms/LoginForm/LoginForm';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import Footer from '../../../organisms/Footer/Footer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Login redirect - User:', user);

      // Force redirect based on user type (case-insensitive)
      let dashboardPath = '/';

      if (user.type.toLowerCase() === 'admin' || user.type.toLowerCase() === 'system-admin') {
        dashboardPath = '/admin/dashboard';
      } else if (user.type.toLowerCase() === 'member') {
        dashboardPath = '/member/dashboard';
      } else if (user.type.toLowerCase() === 'customer') {
        dashboardPath = '/customer/dashboard';
      }

      console.log('Redirecting to:', dashboardPath);

      // Force the correct dashboard path based on user type
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLoginSuccess = () => {
    // Only called when login is actually successful
    console.log('Login successful');
  };

  const handleLoginError = (error: string) => {
    // Called when login fails
    console.error('Login failed:', error);
  };

  return (
    <div>
      <PublicNavigation />
      <div className={styles.loginContainer}>
        <div className={styles.loginFormContainer}>
          <h3 className={styles.title}>Welcome Back</h3>
          <p>Sign in to continue to your account</p>

          <LoginForm
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />

        </div>
        <div className={styles.imgContainer}>
          <img src={require('../../../../assets/images/signup-background.jpg')} alt="Login background" />
        </div>
      </div>
      <NewsletterSubscription />
      <Footer />
    </div>
  );
};

export default Login;



