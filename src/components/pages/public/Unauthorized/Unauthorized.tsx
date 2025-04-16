import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import styles from './Unauthorized.module.css';

const Unauthorized: React.FC = () => {
  return (
    <div className={styles.unauthorizedContainer}>
      <PublicNavigation />
      
      <div className={styles.content}>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please contact your administrator if you believe this is an error.</p>
        
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>Go to Home</Link>
          <Link to="/login" className={styles.loginButton}>Login with Different Account</Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Unauthorized;
