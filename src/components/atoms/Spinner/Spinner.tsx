import React from 'react';
import styles from './Spinner.module.css';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerColor = 'default' | 'primary' | 'secondary' | 'white';

interface SpinnerProps {
  /**
   * The size of the spinner
   * @default 'medium'
   */
  size?: SpinnerSize;
  
  /**
   * The color of the spinner
   * @default 'primary'
   */
  color?: SpinnerColor;
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Spinner component for indicating loading state
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className,
  ...rest
}) => {
  // Combine class names based on props
  const spinnerClasses = [
    styles.spinner,
    styles[`size-${size}`],
    styles[`color-${color}`],
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={spinnerClasses} role="status" {...rest}>
      <div className={styles.circle}></div>
      <span className={styles.srOnly}>Loading...</span>
    </div>
  );
};

export default Spinner;
