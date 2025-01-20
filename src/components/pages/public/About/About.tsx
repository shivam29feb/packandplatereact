import React from 'react';
import styles from './About.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import Contact from '../Contact/Contact';

const About: React.FC = () => {
  return (

  <div className="about-container">
      <PublicNavigation />
      <section className={styles['hero-section']}>
        <h1>Welcome to Packandplate</h1>
        <h6>Your Partner in Mess or Parcel Point Management</h6>
        <button className="primary-button">Get started</button>
        {/* <img src="path/to/your/image.jpg" alt="Mess or Parcel Point" /> */}
      </section>

      <section className={styles['what-we-do-section']}>
        <div className="what-we-do-content">
          <h2>Simplifying Mess or Parcel Point Management</h2>
          <p>Packandplate is a comprehensive management system designed specifically for mess or parcel points. 
            <br/>
            <br/>
            Our platform streamlines operations, reduces costs, and enhances the overall experience for customers and administrators alike.</p>
        </div>
        <div className="what-we-do-img-container">
          {/* <img src="" alt="" /> */}
        </div>
      </section>

      <section className={styles['small-cards-container']}>
          <div className={styles['small-cards']}>
            <h6>Easy Order Management:</h6>
             <p>Manage orders efficiently and reduce errors.</p>
             </div>
          <div>
            <h6 className={styles['small-cards']}>Real-time Tracking:</h6>
             <p>Track orders in real-time and keep customers informed.</p>
             </div>
          <div className={styles['small-cards']}>
            <h6>Automated Reporting:</h6>
             <p>Generate reports and analytics to optimize operations.</p>
             </div>
      </section>

      <section className="our-mission-section">
        <h2>Empowering Mess or Parcel Points to Succeed</h2>
        <p>At Packandplate, we're committed to providing innovative solutions that help mess or parcel points thrive. Our mission is to make management easier, so you can focus on what matters most - providing excellent service to your customers.</p>
      </section>

   
      <Contact />
      <NewsletterSubscription/>
      <Footer />

    </div>
  );
};

export default About;