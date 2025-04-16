import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface ToastProps {
  /**
   * The message to display in the toast
   */
  message: string;
  
  /**
   * The variant of the toast
   * @default 'default'
   */
  variant?: ToastVariant;
  
  /**
   * The position of the toast
   * @default 'top-right'
   */
  position?: ToastPosition;
  
  /**
   * Whether the toast is open
   */
  open: boolean;
  
  /**
   * Callback fired when the toast is closed
   */
  onClose: () => void;
  
  /**
   * The duration in milliseconds to show the toast
   * @default 5000
   */
  duration?: number;
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Toast component for displaying notifications
 */
const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'default',
  position = 'top-right',
  open,
  onClose,
  duration = 5000,
  className,
  ...rest
}) => {
  // Auto-close the toast after duration
  useEffect(() => {
    if (open && duration !== Infinity) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, duration, onClose]);
  
  if (!open) return null;
  
  // Combine class names based on props
  const toastClasses = [
    styles.toast,
    styles[`variant-${variant}`],
    styles[`position-${position}`],
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={toastClasses} role="alert" {...rest}>
      <div className={styles.content}>
        {getIconForVariant(variant)}
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
};

/**
 * Helper function to get the appropriate icon for the toast variant
 */
function getIconForVariant(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
        </svg>
      );
    case 'error':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
        </svg>
      );
    case 'info':
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default Toast;
