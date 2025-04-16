import React from 'react';
import styles from './Typography.module.css';

export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'subtitle1' 
  | 'subtitle2' 
  | 'body1' 
  | 'body2' 
  | 'caption' 
  | 'overline';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export type TypographyColor = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info';

interface TypographyProps {
  /**
   * The variant of the typography
   * @default 'body1'
   */
  variant?: TypographyVariant;
  
  /**
   * The component to render the typography as
   * If not provided, it will be determined based on the variant
   */
  component?: React.ElementType;
  
  /**
   * The text alignment
   * @default 'left'
   */
  align?: TypographyAlign;
  
  /**
   * The color of the text
   * @default 'default'
   */
  color?: TypographyColor;
  
  /**
   * Whether the text should be displayed as a block element
   * @default false
   */
  block?: boolean;
  
  /**
   * Whether the text should be truncated with an ellipsis if it's too long
   * @default false
   */
  noWrap?: boolean;
  
  /**
   * Whether the text should be displayed with a gutterBottom margin
   * @default false
   */
  gutterBottom?: boolean;
  
  /**
   * Additional class name
   */
  className?: string;
  
  /**
   * The content of the typography
   */
  children: React.ReactNode;
}

/**
 * Typography component for consistent text styling
 */
const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  component,
  align = 'left',
  color = 'default',
  block = false,
  noWrap = false,
  gutterBottom = false,
  className,
  children,
  ...rest
}) => {
  // Determine the component to render based on the variant if not provided
  const Component = component || getComponentFromVariant(variant);
  
  // Combine class names based on props
  const typographyClasses = [
    styles.typography,
    styles[`variant-${variant}`],
    styles[`align-${align}`],
    styles[`color-${color}`],
    block ? styles.block : '',
    noWrap ? styles.noWrap : '',
    gutterBottom ? styles.gutterBottom : '',
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <Component className={typographyClasses} {...rest}>
      {children}
    </Component>
  );
};

/**
 * Helper function to determine the component to render based on the variant
 */
function getComponentFromVariant(variant: TypographyVariant): React.ElementType {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    case 'h5':
      return 'h5';
    case 'h6':
      return 'h6';
    case 'subtitle1':
    case 'subtitle2':
      return 'h6';
    case 'body1':
    case 'body2':
      return 'p';
    case 'caption':
    case 'overline':
      return 'span';
    default:
      return 'p';
  }
}

export default Typography;
