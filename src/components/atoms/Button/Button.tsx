import React, { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSeverity = 'default' | 'success' | 'warning' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * The severity level of the button
   * @default 'default'
   */
  severity?: ButtonSeverity;

  /**
   * The size of the button
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Whether the button should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Optional icon to display before the button text
   */
  startIcon?: React.ReactNode;

  /**
   * Optional icon to display after the button text
   */
  endIcon?: React.ReactNode;

  /**
   * The content of the button
   */
  children: React.ReactNode;
}

/**
 * Button component that supports different variants, states, and severity levels
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  severity = 'default',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  className,
  disabled,
  ...rest
}) => {
  // Combine class names based on props
  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`severity-${severity}`],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...rest}
    >
      {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
      <span className={styles.content}>{children}</span>
      {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
    </button>
  );
};

export default Button;
