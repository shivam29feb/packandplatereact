import React from 'react';
import styles from './Card.module.css';

export type CardVariant = 'outlined' | 'elevated' | 'filled';

interface CardProps {
  /**
   * The variant of the card
   * @default 'elevated'
   */
  variant?: CardVariant;
  
  /**
   * Whether the card should take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * The content of the card
   */
  children: React.ReactNode;
  
  /**
   * Additional class name
   */
  className?: string;
  
  /**
   * Click handler for the card
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * Card component for displaying content in a card format
 */
const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  fullWidth = false,
  children,
  className,
  onClick,
  ...rest
}) => {
  // Combine class names based on props
  const cardClasses = [
    styles.card,
    styles[`variant-${variant}`],
    fullWidth ? styles.fullWidth : '',
    onClick ? styles.clickable : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};

/**
 * Card Header component for displaying a header in a card
 */
export const CardHeader: React.FC<{
  title: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({
  title,
  subheader,
  action,
  className,
  ...rest
}) => {
  const headerClasses = [
    styles.cardHeader,
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={headerClasses} {...rest}>
      <div className={styles.headerContent}>
        <div className={styles.title}>{title}</div>
        {subheader && <div className={styles.subheader}>{subheader}</div>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

/**
 * Card Content component for displaying content in a card
 */
export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({
  children,
  className,
  ...rest
}) => {
  const contentClasses = [
    styles.cardContent,
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={contentClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card Actions component for displaying actions in a card
 */
export const CardActions: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}> = ({
  children,
  className,
  align = 'left',
  ...rest
}) => {
  const actionsClasses = [
    styles.cardActions,
    styles[`align-${align}`],
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={actionsClasses} {...rest}>
      {children}
    </div>
  );
};

/**
 * Card Media component for displaying media in a card
 */
export const CardMedia: React.FC<{
  image: string;
  alt?: string;
  height?: number | string;
  className?: string;
}> = ({
  image,
  alt = '',
  height = 200,
  className,
  ...rest
}) => {
  const mediaClasses = [
    styles.cardMedia,
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={mediaClasses} 
      style={{ 
        backgroundImage: `url(${image})`,
        height: typeof height === 'number' ? `${height}px` : height
      }}
      role="img"
      aria-label={alt}
      {...rest}
    />
  );
};

export default Card;
