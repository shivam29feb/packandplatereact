import React, { useState, useRef } from 'react';
import { useAuth, type UserType } from '../../../context/AuthContext';
import Button from '../../atoms/Button/Button';
import Typography from '../../atoms/Typography/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './LoginForm.module.css';

type FormData = {
  email: string;
  password: string;
  userType: UserType;
};

type FormErrors = {
  email: string;
  password: string;
  userType: string;
};

type LoginFormProps = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  isLoading?: boolean;
};

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onError, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    userType: 'customer' as UserType
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: '',
    password: '',
    userType: ''
  });
  
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { login } = useAuth();
  
  const clearError = () => setError('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleAutoFill = (e: React.AnimationEvent<HTMLInputElement>) => {
    if (e.animationName === 'onAutoFillStart') {
      const input = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [input.name]: input.value
      }));
    }
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { email: '', password: '', userType: '' };
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      const result = await login(
        formData.email,
        formData.password,
        formData.userType
      );
      if (result && onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <Typography variant="h4" className={styles.loginTitle}>
          Welcome Back
        </Typography>
        
        {error && (
          <div className={styles.errorMessage}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.loginForm} ref={formRef} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="userType" className={styles.label}>I am a</label>
            <div className={`${styles.inputWrapper} ${formErrors.userType ? styles.error : ''}`}>
              <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className={styles.select}
                disabled={isLoading || isSubmitting}
              >
                <option value="customer">Customer</option>
                <option value="member">Member</option>
              </select>
            </div>
            {formErrors.userType && (
              <Typography variant="caption" className={styles.errorText}>
                {formErrors.userType}
              </Typography>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={`${styles.inputWrapper} ${formErrors.email ? styles.error : ''}`}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onAnimationStart={handleAutoFill}
                placeholder="Enter your email"
                disabled={isLoading || isSubmitting}
                className={styles.input}
                autoComplete="email"
                required
              />
            </div>
            {formErrors.email && (
              <Typography variant="caption" className={styles.errorText}>
                {formErrors.email}
              </Typography>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={`${styles.inputWrapper} ${formErrors.password ? styles.error : ''}`}>
              <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onAnimationStart={handleAutoFill}
                placeholder="Enter your password"
                disabled={isLoading || isSubmitting}
                className={styles.input}
                autoComplete="current-password"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                tabIndex={-1}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {formErrors.password && (
              <Typography variant="caption" className={styles.errorText}>
                {formErrors.password}
              </Typography>
            )}
          </div>
          
          <div className={styles.forgotPassword}>
            <a href="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </a>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || isSubmitting}
            fullWidth
            className={styles.loginButton}
          >
            {isLoading || isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className={styles.signupLink}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <a href="/signup" className={styles.signupLinkText}>
                Sign up
              </a>
            </Typography>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
