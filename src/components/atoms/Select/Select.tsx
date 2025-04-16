import React, { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.css';

export type SelectSize = 'small' | 'medium' | 'large';
export type SelectVariant = 'outlined' | 'filled' | 'standard';
export type SelectStatus = 'default' | 'success' | 'error' | 'warning';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * The size of the select
   * @default 'medium'
   */
  size?: SelectSize;
  
  /**
   * The variant of the select
   * @default 'outlined'
   */
  variant?: SelectVariant;
  
  /**
   * The status of the select
   * @default 'default'
   */
  status?: SelectStatus;
  
  /**
   * Whether the select should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Optional helper text to display below the select
   */
  helperText?: string;
  
  /**
   * Optional label for the select
   */
  label?: string;
  
  /**
   * Options for the select
   */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

/**
 * Select component that supports different variants, sizes, and states
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  size = 'medium',
  variant = 'outlined',
  status = 'default',
  fullWidth = false,
  helperText,
  label,
  options,
  className,
  disabled,
  id,
  ...rest
}, ref) => {
  // Generate a unique ID for the select if not provided
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  // Combine class names based on props
  const selectWrapperClasses = [
    styles.selectWrapper,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    styles[`status-${status}`],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={selectWrapperClasses}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      
      <div className={styles.selectContainer}>
        <select
          ref={ref}
          id={selectId}
          className={styles.select}
          disabled={disabled}
          {...rest}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.arrow}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {helperText && (
        <p className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
