import React, { FormHTMLAttributes } from 'react';
import styles from './Form.module.css';
import Button from '../../atoms/Button/Button';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * The content of the form
   */
  children: React.ReactNode;
  
  /**
   * The text for the submit button
   * @default 'Submit'
   */
  submitText?: string;
  
  /**
   * Whether the form is currently submitting
   * @default false
   */
  isSubmitting?: boolean;
  
  /**
   * Whether to show a cancel button
   * @default false
   */
  showCancel?: boolean;
  
  /**
   * The text for the cancel button
   * @default 'Cancel'
   */
  cancelText?: string;
  
  /**
   * Callback for when the cancel button is clicked
   */
  onCancel?: () => void;
  
  /**
   * Whether the form should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Form component that provides a consistent layout and styling for forms
 */
const Form: React.FC<FormProps> = ({
  children,
  submitText = 'Submit',
  isSubmitting = false,
  showCancel = false,
  cancelText = 'Cancel',
  onCancel,
  fullWidth = false,
  className,
  ...rest
}) => {
  // Combine class names based on props
  const formClasses = [
    styles.form,
    fullWidth ? styles.fullWidth : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <form className={formClasses} {...rest}>
      <div className={styles.formContent}>
        {children}
      </div>
      
      <div className={styles.formActions}>
        {showCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : submitText}
        </Button>
      </div>
    </form>
  );
};

export default Form;
