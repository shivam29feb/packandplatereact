// Customer Management module entry point
import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './CustomerManagement.module.css';
import MemberNavigation from '../../../molecules/MemberNavigation/MemberNavigation';

const CustomerManagement = () => {
  return (
    <div className={styles.customerManagement}>
      <MemberNavigation />
      <Outlet />
    </div>
  );
};

export default CustomerManagement;
