import React, { useState } from 'react';
import styles from './LoginForm.module.css';
import { UserType, useAuth } from '../../../context/AuthContext';

interface LoginFormProps {
  /**
   * Callback for when the login is successful
   */
  onSuccess?: () => void;

  /**
   * Callback for when the login fails
   */
  onError?: (error: string) => void;
}

/**
 * LoginForm component that uses our atomic components
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
}) => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'member' as UserType
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear form errors when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear auth error when user types
    if (error) {
      clearError();
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate password
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // login now returns a boolean indicating success
      const success = await login(formData.email, formData.password, formData.userType);

      if (success) {
        // If login was successful
        onSuccess?.();
      } else if (error) {
        // If there's an error from the context
        onError?.(error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      onError?.(errorMessage);
    }
  };

  const userTypeOptions = [
    { value: 'member', label: 'Member' },
    { value: 'admin', label: 'Admin' },
    { value: 'customer', label: 'Customer' }
  ];

  return (
    <div className={styles.loginForm}>
      {error && (
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
            disabled={isLoading}
          />
          {formErrors.email && <p className={styles.fieldError}>{formErrors.email}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={`${styles.input} ${formErrors.password ? styles.inputError : ''}`}
              disabled={isLoading}
            />
            <i
              className={`${showPassword ? "fas fa-eye-slash" : "fas fa-eye"} ${styles.passwordToggle}`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          {formErrors.password && <p className={styles.fieldError}>{formErrors.password}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="userType">Login As</label>
          <select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className={styles.input}
            disabled={isLoading}
          >
            {userTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.signupContainer}>
          <span>Don't have an account?</span>
          <a href="/signup"><span>Sign Up</span></a>
        </div>

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;


