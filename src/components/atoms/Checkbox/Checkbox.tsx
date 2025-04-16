import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Checkbox.module.css';

export type CheckboxSize = 'small' | 'medium' | 'large';
export type CheckboxStatus = 'default' | 'success' | 'error' | 'warning';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * The size of the checkbox
   * @default 'medium'
   */
  size?: CheckboxSize;
  
  /**
   * The status of the checkbox
   * @default 'default'
   */
  status?: CheckboxStatus;
  
  /**
   * The label for the checkbox
   */
  label?: string;
  
  /**
   * Whether the checkbox is indeterminate
   * @default false
   */
  indeterminate?: boolean;
  
  /**
   * Optional helper text to display below the checkbox
   */
  helperText?: string;
}

/**
 * Checkbox component that supports different sizes and states
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  size = 'medium',
  status = 'default',
  label,
  indeterminate = false,
  helperText,
  className,
  disabled,
  id,
  ...rest
}, ref) => {
  // Generate a unique ID for the checkbox if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  // Create a ref to handle the indeterminate state
  const innerRef = React.useRef<HTMLInputElement>(null);
  
  // Combine refs
  const combinedRef = (node: HTMLInputElement) => {
    // Update the innerRef
    if (innerRef.current) {
      innerRef.current = node;
    }
    
    // Forward the ref
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };
  
  // Update indeterminate state when it changes
  React.useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);
  
  // Combine class names based on props
  const checkboxWrapperClasses = [
    styles.checkboxWrapper,
    styles[`size-${size}`],
    styles[`status-${status}`],
    disabled ? styles.disabled : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={checkboxWrapperClasses}>
      <div className={styles.checkboxContainer}>
        <input
          ref={combinedRef}
          type="checkbox"
          id={checkboxId}
          className={styles.checkbox}
          disabled={disabled}
          {...rest}
        />
        <label htmlFor={checkboxId} className={styles.label}>
          <span className={styles.checkmark}></span>
          {label && <span className={styles.labelText}>{label}</span>}
        </label>
      </div>
      
      {helperText && (
        <p className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
