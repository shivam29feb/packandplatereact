import React, { useEffect, useState } from 'react';
import styles from './Modal.module.css';
import Button from '../../atoms/Button/Button';
import '../../../styles/animations.css';

export type ModalSize = 'small' | 'medium' | 'large' | 'fullScreen';

interface ModalProps {
  /**
   * Whether the modal is open
   */
  open: boolean;

  /**
   * Callback fired when the modal is closed
   */
  onClose: () => void;

  /**
   * The size of the modal
   * @default 'medium'
   */
  size?: ModalSize;

  /**
   * The content of the modal
   */
  children: React.ReactNode;

  /**
   * Additional class name
   */
  className?: string;

  /**
   * Animation for the modal
   * @default 'fade'
   */
  animation?: 'fade' | 'scale' | 'slideTop' | 'slideBottom' | 'none';
}

/**
 * Modal component for displaying content in a layer above the app
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  size = 'medium',
  children,
  className,
  animation = 'fade',
  ...rest
}) => {
  // State for animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Handle animation and visibility
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = '';
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!isVisible && !open) return null;

  // Get animation classes
  const getAnimationClasses = () => {
    if (animation === 'none') return '';

    const animationMap = {
      fade: isAnimating ? 'animate-fadeIn' : 'animate-fadeOut',
      scale: isAnimating ? 'animate-scaleIn' : 'animate-scaleOut',
      slideTop: isAnimating ? 'animate-slideInTop' : 'animate-slideOutTop',
      slideBottom: isAnimating ? 'animate-slideInBottom' : 'animate-slideOutBottom',
    };

    return animationMap[animation] || '';
  };

  // Combine class names based on props
  const modalClasses = [
    styles.modal,
    styles[`size-${size}`],
    getAnimationClasses(),
    className || ''
  ].filter(Boolean).join(' ');

  // Backdrop animation class
  const backdropClass = [
    styles.backdrop,
    isAnimating ? 'animate-fadeIn' : 'animate-fadeOut'
  ].join(' ');

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={backdropClass} onClick={handleBackdropClick}>
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Modal Header component
 */
export const ModalHeader: React.FC<{
  title: React.ReactNode;
  onClose?: () => void;
  className?: string;
}> = ({
  title,
  onClose,
  className,
  ...rest
}) => {
  const headerClasses = [
    styles.modalHeader,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={headerClasses} {...rest}>
      <h2 className={styles.modalTitle}>{title}</h2>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          &times;
        </button>
      )}
    </div>
  );
};

/**
 * Modal Content component
 */
export const ModalContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
  ...rest
}) => {
  const contentClasses = [
    styles.modalContent,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={contentClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Modal Footer component
 */
export const ModalFooter: React.FC<{
  children?: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  className?: string;
}> = ({
  children,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onCancel,
  onConfirm,
  className,
  ...rest
}) => {
  const footerClasses = [
    styles.modalFooter,
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className={footerClasses} {...rest}>
      {children || (
        <>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button variant="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Modal;
