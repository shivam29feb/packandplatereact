import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import Footer from '../../../organisms/Footer/Footer';
import styles from './Home.module.css';


const Home = () => {
  return (
    <div>
      
      <PublicNavigation />
      <section className={styles['hero']}>
        <h2>Start Your Culinary Journey</h2>
        <p>Discover the benefits of using Pack and Plate, and sign up for a parcel point today.</p>
        <div className={styles['buttons-container']}>
          <button className={`${styles['primary-button']} primary-button`}>Sign Up</button>
          <button className={`${styles['secondary-button']} secondary-button`}>Pricing</button>
        </div>
      </section>

      <section className={styles['value-proposition']}>
        <h2>Why Choose Pack and Plate?</h2>
        <div className={styles['value-card-container']}>
          <div className={styles['value-card']}>
            <h3>Convenience</h3>
            <p>Manage your monthly memberships in one place.</p>
            <button className={`${styles['primary-button']} primary-button`}>Learn More</button>
          </div>
          <div className={styles['value-card']}>
            <h3>Easy Integration</h3>
            <p>Integrate Pack and Plate with your existing website or app.</p>
            <button className={`${styles['primary-button']} primary-button`}>Learn More</button>
          </div>
          <div className={styles['value-card']}>
            <h3>Clear Analytics</h3>
            <p>View your membership metrics in one place.</p>
            <button className={`${styles['primary-button']} primary-button`}>Learn More</button>
          </div>
        </div>
      </section>

      <section className={styles['feature-highlights']}>
        <h2>Key Features</h2>
        <div className={styles['feature-card-container']}>
        <div className={styles['feature-card']}>
          <h3>Customizable <br/>Plans</h3>
          <p>Create plans that fit your business needs.</p>
          <button className={`${styles['primary-button']} primary-button`}>Learn More</button>
        </div>
        <div className={styles['feature-card']}>
          <h3>Automated Notifications</h3>
          <p>Automate membership notifications and reminders.</p>
          <button className={`${styles['primary-button']} primary-button`}>Learn More</button>
        </div>
        <div className={styles['feature-card']}>
          <h3>Insights and <br/>Analytics</h3>
          <p>Track your membership metrics and make data-driven decisions.</p>
          <button className={`${styles['primary-button']} primary-button`}>Learn More</button>
        </div>
        </div>
      </section>    
      <NewsletterSubscription/>
      <Footer />
    </div>
  );
};

export default Home;
export {};