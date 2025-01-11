import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const redirectTo = (path: string) => {
    return () => navigate(path);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <div className={styles['about']}>
          <p>
            A parcel point/mess management system for efficient attendance tracking and
            membership management.
          </p>
          <div className={styles['social-icons']}>
            <span onClick={redirectTo('#')}><i className="fab fa-facebook"></i></span>
            <span onClick={redirectTo('#')}><i className="fab fa-twitter"></i></span>
            <span onClick={redirectTo('#')}><i className="fab fa-instagram"></i></span>
            <span onClick={redirectTo('#')}><i className="fab fa-linkedin"></i></span>
          </div>
        </div>
        <div className={styles['menu']}>
          <h6>Main Menu</h6>
          <ul className={styles['footer-section-content']}>
            <li><span onClick={redirectTo('/')}>Home</span></li>
            <li><span onClick={redirectTo('/about')}>About</span></li>
            <li><span onClick={redirectTo('/services')}>Services</span></li>
            <li><span onClick={redirectTo('/contact')}>Contact</span></li>
          </ul>
        </div>
        {/* <div className="footer-section submenu">
          <h3>Submenu</h3>
          <ul>
            <li>Lorem ipsum</li>
            <li>Lorem ipsum</li>
            <li>Lorem ipsum</li>
            <li>Lorem ipsum</li>
          </ul>
        </div> */}
        <div className={styles['quick-links']}>
          <h6>Quick Links</h6>
          <ul className={styles['footer-section-content']}>
            <li><span onClick={redirectTo('/sitemap')}>Sitemap</span></li>
            <li><span onClick={redirectTo('/disclaimer')}>Disclaimer</span></li>
            <li><span onClick={redirectTo('/privacy-policy')}>Privacy Policy</span></li>
            <li><span onClick={redirectTo('/terms-and-conditions')}>Terms and Conditions</span></li>
          </ul>
        </div>
      </div>
      <div className={styles['footer-bottom']}>
        <p>&copy; {new Date().getFullYear()} Pack and Plate. All rights reserved.</p>
        <p><span onClick={redirectTo('/terms-and-conditions')}>Terms of Service</span> | <span onClick={redirectTo('/privacy-policy')}>Privacy Policy</span></p>
      </div>
    </footer>
  );
}; 

export default Footer;
