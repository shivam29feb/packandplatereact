import React from 'react';
import styles from './Divider.module.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'fullWidth' | 'inset' | 'middle';

interface DividerProps {
  /**
   * The orientation of the divider
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  
  /**
   * The variant of the divider
   * @default 'fullWidth'
   */
  variant?: DividerVariant;
  
  /**
   * Optional text to display in the middle of the divider
   */
  children?: React.ReactNode;
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Divider component for separating content
 */
const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  children,
  className,
  ...rest
}) => {
  // Combine class names based on props
  const dividerClasses = [
    styles.divider,
    styles[`orientation-${orientation}`],
    styles[`variant-${variant}`],
    children ? styles.withChildren : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={dividerClasses} role="separator" {...rest}>
      {children && (
        <span className={styles.content}>
          {children}
        </span>
      )}
    </div>
  );
};

export default Divider;
