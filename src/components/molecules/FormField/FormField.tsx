import React from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  /**
   * The label for the form field
   */
  label?: string;

  /**
   * Whether the form field is required
   * @default false
   */
  required?: boolean;

  /**
   * Helper text to display below the form field
   */
  helperText?: string;

  /**
   * Error message to display below the form field
   */
  error?: string;

  /**
   * The content of the form field
   */
  children: React.ReactNode;

  /**
   * Whether the form field should take the full width of its container
   * @default true
   */
  fullWidth?: boolean;
}

/**
 * FormField component that provides a consistent layout for form fields
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  helperText,
  error,
  children,
  fullWidth = true,
}) => {
  // Generate a unique ID for the form field
  const fieldId = React.useId();

  // Combine class names based on props
  const formFieldClasses = [
    styles.formField,
    fullWidth ? styles.fullWidth : '',
    error ? styles.hasError : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={formFieldClasses}>
      {label && (
        <label htmlFor={fieldId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.fieldContent}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              id: fieldId,
              'aria-describedby': error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined,
              'aria-invalid': error ? 'true' : undefined,
            })
          : children}
      </div>

      {error ? (
        <p id={`${fieldId}-error`} className={styles.error}>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${fieldId}-helper`} className={styles.helperText}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
