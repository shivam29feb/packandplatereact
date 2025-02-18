import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicNavigation.module.css';

const PublicNavigation: React.FC = () => {
  // toggles the navbarOpen state variable, which determines whether the
  // responsive navbar is open or closed.

  const [navbarOpen, setNavbarOpen] = React.useState(false);

  // toggles the dropdownOpen state variable, which determines whether the dropdown
  // menu inside the 'Sign up' and 'Log in' links is open or closed.

  const [dropdownOpenSignup, setDropdownOpenSignup] = React.useState(false);
  const toggleDropdownSignup = () => setDropdownOpenSignup(!dropdownOpenSignup);

  const [dropdownOpenLogin, setDropdownOpenLogin] = React.useState(false);
  const toggleDropdownLogin = () => setDropdownOpenLogin(!dropdownOpenLogin);

  const [dropdownOpenFeedback, setDropdownOpenFeedback] = React.useState(false);
  const toggleDropdownFeedback = () => setDropdownOpenFeedback(!dropdownOpenFeedback);



  return (
    
    <div className={styles.publicNavigationContainer}>
      <div className={navbarOpen ? styles.navToggleHidden : styles.navToggle} onClick={() => setNavbarOpen(!navbarOpen)}>
        <i className="fas fa-bars"></i>
      </div>

      <nav className={`${styles.publicNavigation} ${navbarOpen ? styles.open : ''}`}>
        <div className={`${styles.navToggleInside} ${navbarOpen ? styles.open : ''}`} onClick={() => setNavbarOpen(!navbarOpen)}>
          <i className="fas fa-bars" />
        </div>


        <ul>
          <li>
            <Link to="/" >Home</Link>
          </li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>

          <li className={styles.feedbackDropdown}>
            <div className={styles.dropdownHeader} onClick={() => setDropdownOpenFeedback(!dropdownOpenFeedback)}>
              <span className={styles.dropdownHeaderText} onClick={toggleDropdownFeedback}>Feedback</span>
            </div>
            <div className={styles.dropdownContent} style={{display: dropdownOpenFeedback ? 'block' : 'none'}}>
              <Link className={styles.dropdownLink} to="/feature-request">Feature Request</Link>
              <Link className={styles.dropdownLink} to="/report-an-issue">Report an Issue</Link>
            </div>
          </li>
          
          <li className={styles.signupDropdown}>
            <div className={styles.dropdownHeader} onClick={toggleDropdownSignup}>
              <span className={styles.dropdownHeaderText}>Get Started</span>
              
            </div>
            <div className={styles.dropdownContent} style={{display: dropdownOpenSignup ? 'block' : 'none'}}>
              <Link className={styles.dropdownLink} to="/signup">User</Link>
              <Link className={styles.dropdownLink} to="/signup">Member</Link>
              <Link className={styles.dropdownLink} to="/admin-signup">Admin</Link>
            </div>
          </li>
          <li className={styles.loginDropdown}>
            <div className={styles.dropdownHeader} onClick={toggleDropdownLogin}>
              <span className={styles.dropdownHeaderText}>Welcome back</span>
            </div>
            <div className={styles.dropdownContent} style={{display: dropdownOpenLogin ? 'block' : 'none'}}>
              <Link className={styles.dropdownLink} to="/login">User</Link>
              <Link className={styles.dropdownLink} to="/login">Member</Link>
              <Link className={styles.dropdownLink} to="/admin-login">Admin</Link>
            </div>
          </li>

          
          

        </ul>
      </nav>
    </div>
  );
};

export default PublicNavigation;
