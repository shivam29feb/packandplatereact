import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.css';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'outlined' | 'filled' | 'standard';
export type InputStatus = 'default' | 'success' | 'error' | 'warning';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
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
  ...rest
}, ref) => {
  // Generate a unique ID for the input if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Combine class names based on props
  const inputWrapperClasses = [
    styles.inputWrapper,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    styles[`status-${status}`],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
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
          disabled={disabled}
          {...rest}
        />
        
        {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
      </div>
      
      {helperText && (
        <p className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
