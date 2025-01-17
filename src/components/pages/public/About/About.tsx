import React from 'react';
import './About.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';

const About: React.FC = () => {
  return (

  <div className="about-container">
      <PublicNavigation />
      <section className="hero-section">
        <h1>Welcome to Packandplate</h1>
        <h2>Your Partner in Mess or Parcel Point Management</h2>
        <img src="path/to/your/image.jpg" alt="Mess or Parcel Point" />
      </section>

      <section className="what-we-do-section">
        <h2>Simplifying Mess or Parcel Point Management</h2>
        <p>Packandplate is a comprehensive management system designed specifically for mess or parcel points. Our platform streamlines operations, reduces costs, and enhances the overall experience for customers and administrators alike.</p>
        <ul>
          <li>Easy Order Management: Manage orders efficiently and reduce errors.</li>
          <li>Real-time Tracking: Track orders in real-time and keep customers informed.</li>
          <li>Automated Reporting: Generate reports and analytics to optimize operations.</li>
        </ul>
      </section>

      <section className="our-mission-section">
        <h2>Empowering Mess or Parcel Points to Succeed</h2>
        <p>At Packandplate, we're committed to providing innovative solutions that help mess or parcel points thrive. Our mission is to make management easier, so you can focus on what matters most - providing excellent service to your customers.</p>
      </section>

      <section className="get-in-touch-section">
        <h2>Contact Us</h2>
        <p>Have questions or need support? We're here to help. Reach out to us through our contact form or social media channels.</p>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" required></textarea>

          <button type="submit">Submit</button>
        </form>
        <div className="social-media-links">
          {/* Add your social media links here */}
        </div>
      </section>

      <div className="cta-button">
        <a href="/home">Learn More</a>
      </div>

      <NewsletterSubscription/>
      <Footer />

    </div>
  );
};

export default About;