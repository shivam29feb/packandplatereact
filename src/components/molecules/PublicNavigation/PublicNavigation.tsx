import React from 'react';
import { Link } from 'react-router-dom';
import './PublicNavigation.css';

const PublicNavigation: React.FC = () => {
  return (
    <nav className="public-navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default PublicNavigation;
