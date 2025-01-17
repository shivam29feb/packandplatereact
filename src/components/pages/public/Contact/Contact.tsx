import React from 'react';
import styles from './Contact.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';

const Contact: React.FC = () => {
  return (
    <div className={styles['contact-container']}>
      <PublicNavigation />

      <section className={styles['welcome-section']}>
        <h5>Contact Our Team</h5>
        <p>Got any questions about the product or scaling on our platform? We are here to help. Chat with our Friendly team 24/7 and get onboard in less than 5 minutes.</p>
      </section>

      <section className={styles['contact-content']}>
        <form className={styles['contact-form-container']}>
          
          <div className={styles['contact-field']}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className={styles['contact-field']}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={styles['contact-field']}>
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" />
          </div>

          <div className={styles['contact-field']}>
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>

          <button type="submit" className="primary-button">Get Started</button>
        </form>
        <div className={styles['contact-info-container']}>
          <div className={styles['contact-info-header']}>
            <h6>Chat with us</h6>
            <p>Speak to our friendly team via live chat</p>
          </div>

          <div className={styles['contact-info-content']}>
            <div className={styles['contact-link-container']}>
              <i className='fas fa-chat'></i>
              <button className="ghost-button">Start a live chat</button>
            </div>
            <div className={styles['contact-link-container']}>
              <i className='fas fa-envelope'></i>
              <button className="ghost-button">Shoot us an email</button>
            </div>

            <div className={styles['contact-info-header']}>
              <h6>Call us</h6>
              <p>Call our team from Mon-Fri 10:00 am to 6:00 pm</p>
            </div>
          </div>

        </div>
      </section>

      <section className={styles['address-map-section']}>
        <h2>Find Us on the Map</h2>
        <p>Our address on the map.</p>
        <iframe src="[Insert Map Embed]" title="Packandplate Location" width="600" height="450"></iframe>
      </section>

      <NewsletterSubscription/>
      <Footer />
    </div>
  );
};

export default Contact;
