import React from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'filled' | 'outlined';
export type BadgeColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  /**
   * The content of the badge
   */
  children: React.ReactNode;
  
  /**
   * The variant of the badge
   * @default 'filled'
   */
  variant?: BadgeVariant;
  
  /**
   * The color of the badge
   * @default 'default'
   */
  color?: BadgeColor;
  
  /**
   * The size of the badge
   * @default 'medium'
   */
  size?: BadgeSize;
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Badge component for displaying status or count
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'filled',
  color = 'default',
  size = 'medium',
  className,
  ...rest
}) => {
  // Combine class names based on props
  const badgeClasses = [
    styles.badge,
    styles[`variant-${variant}`],
    styles[`color-${color}`],
    styles[`size-${size}`],
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <span className={badgeClasses} {...rest}>
      {children}
    </span>
  );
};

export default Badge;
