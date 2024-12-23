
import React from 'react';
import { Link } from 'react-router-dom';
import './MemberNavigation.css';
import './Sidebar.css';

const MemberNavigation: React.FC = () => {
  return (
    <nav className="member-navigation">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/add-dish">Add Dish</Link></li>
        <li><Link to="/view-dish">View Dishes</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default MemberNavigation;