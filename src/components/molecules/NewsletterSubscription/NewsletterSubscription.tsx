import React from 'react';
import styles from './NewsletterSubscription.module.css';

const NewsletterSubscription: React.FC = () => {
  return (
    <div className={styles['newsletter-subscription-container']}>
        <div className={styles['newsletter-subscription-header']}>
            <h4>Join Our Weekly Newsletter</h4>
            <p>Stay upto date with latest news, announcements and articles</p>
        </div>
        <div className={styles['newsletter-subscription-email-container']}>
            <input type="text" name="" id="" placeholder='Enter your email'/>
            <button type="submit">Subscribe</button>
        </div>
    </div>
  );
};

export default NewsletterSubscription;