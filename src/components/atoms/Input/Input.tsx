import React, { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import styles from './Input.module.css';

export type InputSize = 'compact' | 'small' | 'medium' | 'large';
export type InputVariant = 'outlined' | 'filled' | 'standard' | 'unstyled';
export type InputStatus = 'default' | 'success' | 'error' | 'warning';

type InputType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'file'
  | 'checkbox'
  | 'radio'
  | 'range';

type MaskFunction = (value: string) => string;

const defaultMasks: Record<string, MaskFunction> = {
  phone: (value: string) => 
    value
      .replace(/\D/g, '')
      .replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, (_, p1, p2, p3) => 
        [p1, p2, p3].filter(Boolean).join('-'))
      .substring(0, 12),
  creditCard: (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19),
  date: (value: string) =>
    value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
      .substring(0, 10)
};


interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * The HTML input type
   * @default 'text'
   */
  type?: InputType;
  
  /**
   * Predefined mask type or custom mask function
   */
  mask?: 'phone' | 'creditCard' | 'date' | MaskFunction;
  
  /**
   * Show loading spinner
   * @default false
   */
  loading?: boolean;
  
  /**
   * Loading spinner component (overrides default)
   */
  loadingIndicator?: React.ReactNode;
  
  /**
   * Debounce time in milliseconds for onChange
   */
  debounceTime?: number;
  /**
   * The size of the input
   * @default 'medium'
   */
  size?: InputSize;
  
  /**
   * The variant of the input
   * @default 'outlined'
   */
  variant?: InputVariant;
  
  /**
   * The status of the input
   * @default 'default'
   */
  status?: InputStatus;
  
  /**
   * Whether the input should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Optional icon to display at the start of the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Optional icon to display at the end of the input
   */
  endIcon?: React.ReactNode;
  
  /**
   * Optional helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Optional label for the input
   */
  label?: string;
}

/**
 * Input component that supports different variants, sizes, and states
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'medium',
  variant = 'outlined',
  status = 'default',
  fullWidth = false,
  startIcon,
  endIcon,
  helperText,
  label,
  className,
  disabled,
  id,
  type = 'text',
  mask,
  loading = false,
  loadingIndicator,
  debounceTime = 0,
  onChange,
  ...rest
}, ref) => {
  // Generate a consistent ID for the input if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Get the name from props for autofill
  const inputName = rest.name || '';
  const [inputValue, setInputValue] = useState(rest.value || rest.defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  
  // Handle input changes with debouncing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Apply mask if provided
    if (mask && typeof mask === 'function') {
      value = mask(value);
    } else if (mask && defaultMasks[mask]) {
      value = defaultMasks[mask](value);
    }
    
    setInputValue(value);
    
    if (onChange) {
      e.persist();
      const event = { ...e, target: { ...e.target, value } };
      
      if (debounceTime > 0) {
        const timer = setTimeout(() => {
          onChange(event as React.ChangeEvent<HTMLInputElement>);
        }, debounceTime);
        return () => clearTimeout(timer);
      } else {
        onChange(event as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };
  
  // Sync with external value changes
  useEffect(() => {
    if (rest.value !== undefined) {
      setInputValue(rest.value);
    }
  }, [rest.value]);
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine input type based on password visibility
  const getInputType = () => {
    if (type !== 'password') return type;
    return showPassword ? 'text' : 'password';
  };

  // Combine class names based on props
  const inputWrapperClasses = [
    styles.inputWrapper,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    styles[`status-${status}`],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    loading ? styles.loading : '',
    isFocused ? styles.focused : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={inputWrapperClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      
      <div className={styles.inputContainer}>
        {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
        
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          type={getInputType()}
          name={inputName}
          value={inputValue}
          disabled={disabled || loading}
          autoComplete={rest.autoComplete || (type === 'email' ? 'username' : type === 'password' ? 'current-password' : undefined)}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          onChange={handleChange}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        
        {(loading || loadingIndicator) && (
          <span className={styles.loadingIndicator}>
            {loadingIndicator || (
              <svg className={styles.spinner} viewBox="0 0 50 50">
                <circle
                  className={styles.spinnerPath}
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="5"
                />
              </svg>
            )}
          </span>
        )}
        
        {isPasswordField && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            tabIndex={-1} // Prevent button from being focused during tab navigation
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        
        {endIcon && !isPasswordField && <span className={styles.endIcon}>{endIcon}</span>}
      </div>
      
      {helperText && (
        <p id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
