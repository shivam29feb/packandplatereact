// Billing and Payment module entry point
import React from 'react';
import styles from './BillingAndPayment.module.css';
import MemberNavigation from '../../../molecules/MemberNavigation/MemberNavigation';


const BillingAndPayment = () => {
  return (
    <div className={styles.billingAndPayment}>
      <MemberNavigation />
      <h1 className={styles.title}>Billing and Payment</h1>
    </div>
  );
};

export default BillingAndPayment;
