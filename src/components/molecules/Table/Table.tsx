import React from 'react';
import styles from './Table.module.css';

export type TableVariant = 'simple' | 'striped' | 'bordered';
export type TableSize = 'small' | 'medium' | 'large';

interface TableProps {
  /**
   * The variant of the table
   * @default 'simple'
   */
  variant?: TableVariant;
  
  /**
   * The size of the table
   * @default 'medium'
   */
  size?: TableSize;
  
  /**
   * Whether the table should take the full width of its container
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * The content of the table
   */
  children: React.ReactNode;
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Table component for displaying data in a tabular format
 */
const Table: React.FC<TableProps> = ({
  variant = 'simple',
  size = 'medium',
  fullWidth = true,
  children,
  className,
  ...rest
}) => {
  // Combine class names based on props
  const tableClasses = [
    styles.table,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth ? styles.fullWidth : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={styles.tableContainer}>
      <table className={tableClasses} {...rest}>
        {children}
      </table>
    </div>
  );
};

/**
 * Table Head component
 */
export const TableHead: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
  ...rest
}) => {
  const headClasses = [
    styles.tableHead,
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <thead className={headClasses} {...rest}>
      {children}
    </thead>
  );
};

/**
 * Table Body component
 */
export const TableBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
  ...rest
}) => {
  const bodyClasses = [
    styles.tableBody,
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <tbody className={bodyClasses} {...rest}>
      {children}
    </tbody>
  );
};

/**
 * Table Row component
 */
export const TableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({
  children,
  className,
  onClick,
  ...rest
}) => {
  const rowClasses = [
    styles.tableRow,
    onClick ? styles.clickable : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <tr 
      className={rowClasses} 
      onClick={onClick}
      {...rest}
    >
      {children}
    </tr>
  );
};

/**
 * Table Cell component
 */
export const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
}> = ({
  children,
  className,
  header = false,
  align = 'left',
  ...rest
}) => {
  const cellClasses = [
    styles.tableCell,
    styles[`align-${align}`],
    className || ''
  ].filter(Boolean).join(' ');
  
  if (header) {
    return (
      <th className={cellClasses} {...rest}>
        {children}
      </th>
    );
  }
  
  return (
    <td className={cellClasses} {...rest}>
      {children}
    </td>
  );
};

export default Table;
