import React from 'react';
import styles from './LoadingState.module.css';
import Spinner from '../../atoms/Spinner/Spinner';
import Typography from '../../atoms/Typography/Typography';

export interface LoadingStateProps {
  /**
   * The message to display
   * @default 'Loading...'
   */
  message?: string;
  
  /**
   * The size of the spinner
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether to show the loading state as an overlay
   * @default false
   */
  overlay?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * LoadingState component for indicating loading state with a message
 */
const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
  overlay = false,
  className = '',
}) => {
  const loadingStateClasses = [
    styles.loadingState,
    overlay ? styles.overlay : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={loadingStateClasses} role="status" aria-live="polite">
      <div className={styles.loadingStateContent}>
        <Spinner size={size} color="primary" />
        {message && (
          <Typography variant="body1" className={styles.loadingMessage}>
            {message}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default LoadingState;
