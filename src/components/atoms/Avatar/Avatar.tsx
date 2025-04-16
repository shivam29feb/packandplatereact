import React from 'react';
import styles from './Avatar.module.css';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';
export type AvatarVariant = 'circular' | 'rounded' | 'square';

interface AvatarProps {
  /**
   * The source of the avatar image
   */
  src?: string;
  
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  
  /**
   * The size of the avatar
   * @default 'medium'
   */
  size?: AvatarSize;
  
  /**
   * The variant of the avatar
   * @default 'circular'
   */
  variant?: AvatarVariant;
  
  /**
   * The content to display when no image is provided
   */
  children?: React.ReactNode;
  
  /**
   * Additional class name
   */
  className?: string;
}

/**
 * Avatar component for displaying user profile images or initials
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'medium',
  variant = 'circular',
  children,
  className,
  ...rest
}) => {
  // Combine class names based on props
  const avatarClasses = [
    styles.avatar,
    styles[`size-${size}`],
    styles[`variant-${variant}`],
    className || ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={avatarClasses} {...rest}>
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        <div className={styles.fallback}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Avatar;
