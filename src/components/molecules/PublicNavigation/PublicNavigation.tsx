import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PublicNavigation.module.css';
import { useAuth } from '../../../context/AuthContext';

const PublicNavigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  const [dropdownOpenSignup, setDropdownOpenSignup] = React.useState(false);
  const toggleDropdownSignup = () => setDropdownOpenSignup(!dropdownOpenSignup);

  const [dropdownOpenFeedback, setDropdownOpenFeedback] = React.useState(false);
  const toggleDropdownFeedback = () => setDropdownOpenFeedback(!dropdownOpenFeedback);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Determine dashboard link based on user type
  const getDashboardLink = () => {
    if (!user) return '/';

    switch (user.type) {
        case 'system-admin':
        case 'admin':
        return '/admin/dashboard';
      case 'member':
        return '/member/dashboard';
      case 'customer':
        return '/customer/dashboard';
      default:
        return '/';
    }
  };

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
            <Link to="/">Home</Link>
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

          {!isAuthenticated ? (
            <>
              <li className={styles.signupDropdown}>
                <div className={styles.dropdownHeader} onClick={toggleDropdownSignup}>
                  <span className={styles.dropdownHeaderText}>Get Started</span>
                </div>
                <div className={styles.dropdownContent} style={{display: dropdownOpenSignup ? 'block' : 'none'}}>
                  <Link className={styles.dropdownLink} to="/signup">Sign Up</Link>
                </div>
              </li>

              <li>
                <Link to="/login" className={styles.loginLink}>Login</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={getDashboardLink()} className={styles.dashboardLink}>Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default PublicNavigation;


