import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MemberNavigation.module.css';

const MemberNavigation: React.FC = () => {
  return (
    <nav className={styles.memberNavigation}>
      <ul>
        <li><Link to="/member/dashboard">Dashboard</Link></li>
        <li><Link to="/member/profile">Profile</Link></li>
        <li><Link to="/add-dish">Add Dish</Link></li>
        <li><Link to="/view-dish">View Dishes</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default MemberNavigation;
