import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Input from '../../../atoms/Input/Input';
import styles from './AdminLogin.module.css';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== AdminLogin: Form submitted ===');
    setError('');
    
    if (!email || !password) {
      console.log('Validation failed: Email or password is empty');
      setError('Both email and password are required');
      return;
    }

    try {
      console.log('=== AdminLogin: Starting admin login process ===');
      console.log('Email:', email);
      setIsLoading(true);
      
      console.log('Calling auth context login with userType: admin');
      const result = await login(email, password, 'admin');
      
      console.log('=== AdminLogin: Login result ===');
      console.log('Result:', result);
      
      if (result.success && result.user) {
        console.log('Admin login successful!');
        console.log('User data:', result.user);
        console.log('Navigating to /admin/dashboard');
        navigate('/admin/dashboard');
      } else {
        const errorMsg = result.message || 'Invalid admin credentials';
        console.error('Admin login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('=== AdminLogin: Error during login ===');
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Login failed: ${errorMessage}`);
    } finally {
      console.log('=== AdminLogin: Login process completed ===');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['admin-login-page']}>
      <PublicNavigation />
      <div className={styles['admin-login-container']}>
        <div className={styles['admin-login-card']}>
          <div className={styles['login-header']}>
            <h1 className={styles['admin-login-title']}>Admin Portal</h1>
            <p className={styles['login-subtitle']}>Sign in to access the admin dashboard</p>
          </div>
          
          {error && (
            <div className={styles['error-message']}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles['admin-login-form']}>
            <div className={styles['form-group']}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your email"
                autoComplete="username"
                variant="outlined"
                size="medium"
                startIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                }
                fullWidth
              />
            </div>

            <div className={styles['form-group']}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter your password"
                autoComplete="current-password"
                variant="outlined"
                size="medium"
                startIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                fullWidth
              />
              <div className={styles['forgot-password']}>
                <a href="/forgot-password" className={styles['forgot-link']}>
                  Forgot password?
                </a>
              </div>
            </div>

            <button 
            type="submit" 
            className={styles['login-button']}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={styles['support-text']}>
          <p>Contact system administrator for access</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
