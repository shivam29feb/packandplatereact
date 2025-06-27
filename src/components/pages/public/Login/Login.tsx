import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth, UserType } from '../../../../context/AuthContext';
import LoginForm from '../../../organisms/LoginForm/LoginForm';
import Button from '../../../atoms/Button/Button';
import Typography from '../../../atoms/Typography/Typography';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';

// Dashboard routes mapping
const DASHBOARD_ROUTES: Record<UserType, string> = {
  'admin': '/admin/dashboard',
  'system-admin': '/admin/dashboard',
  'member': '/member/dashboard',
  'customer': '/customer/dashboard'
} as const;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, error: authError, clearError } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const { logout } = useAuth();

  // Clear any existing errors when component mounts or when authError changes
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      clearError();
    }
  }, [authError, clearError]);

  // Handle logout and login as different user
  const handleLoginAsDifferentUser = useCallback(async () => {
    try {
      setLoginError(null);
      await logout();
      // Clear any location state to prevent redirects
      navigate('/login', { replace: true, state: {} });
    } catch (error) {
      console.error('Error during logout:', error);
      setLoginError('Failed to log out. Please try again.');
    }
  }, [logout, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // If coming from a redirect or directly to login
      const from = location.state?.from?.pathname || DASHBOARD_ROUTES[user.type];
      
      // Only redirect if not already on the login page to prevent infinite loops
      if (!window.location.pathname.includes('login')) {
        navigate(from, { replace: true, state: { from: location } });
      } else if (location.state?.from?.pathname) {
        // If we're on login page but have a redirect, go there
        navigate(location.state.from.pathname, { replace: true });
      } else {
        // Otherwise go to dashboard
        navigate(DASHBOARD_ROUTES[user.type], { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLoginSuccess = () => {
    // Clear any previous errors on successful login
    setLoginError(null);
    console.log('Login successful');
    
    // The AuthContext will handle the redirect after successful login
  };

  const handleLoginError = (error: string) => {
    console.error('Login error:', error);
    setLoginError(error || 'An error occurred during login. Please try again.');
  };
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      setLoginError(null);
    };
  }, []);

  // If user is already logged in, show a message with option to log out
  if (isAuthenticated && user) {
    return (
      <div className={styles.pageContainer}>
        <PublicNavigation />
        <div className={styles.loginContainer}>
          <div className={styles.loggedInMessage}>
            <Typography variant="h4" className={styles.title}>
              Welcome Back, {user.username || 'User'}!
            </Typography>
            <Typography variant="body1" className={styles.subtitle}>
              You are currently logged in as <strong>{user.email}</strong> with <strong>{user.type}</strong> privileges.
            </Typography>
            
            {loginError && (
              <div className={styles.errorContainer}>
                <Typography variant="body2" className={styles.errorText}>
                  {loginError}
                </Typography>
              </div>
            )}
            
            <div className={styles.buttonGroup}>
              <Button
                variant="primary"
                onClick={() => navigate(DASHBOARD_ROUTES[user.type])}
                className={styles.button}
                fullWidth
              >
                Go to Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={handleLoginAsDifferentUser}
                className={styles.button}
                fullWidth
              >
                Log in as different user
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <PublicNavigation />
      <main className={styles.loginContainer}>
        <div className={styles.formContainer}>
          <header className={styles.header}>
            {/* Welcome message removed as requested */}
          </header>
          
          {loginError && (
            <div className={styles.errorContainer}>
              <Typography variant="body2">
                {loginError}
              </Typography>
            </div>
          )}
          
          <div className={styles.formWrapper}>
            <LoginForm 
              onSuccess={handleLoginSuccess} 
              onError={handleLoginError} 
            />
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Login;



