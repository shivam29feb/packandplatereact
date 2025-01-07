import React from 'react';
import styles from './Pricing.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';

const Pricing: React.FC = () => {
  return (
    <div className="pricing-container">
      <PublicNavigation />

      <section className="hero-section">
        <h1>Get the Right Plan for Your Business</h1>
        <h2>Our pricing plans are designed to fit your needs, whether you're a small or large mess or parcel point.</h2>
        <img src="path/to/your/image.jpg" alt="Pricing Plans" />
      </section>

      <section className={styles['pricing-tiers-section']}>
        <h2>Pricing Plans</h2>
        <p>We offer three pricing plans to fit your needs and budget.</p>
        <div className={styles['pricing-card-container']}>
          <div className={styles['pricing-card']}>
            <h6>Free Plan: ₹0/month</h6>
            <ul>
              <li>Limited features</li>
              <li>Up to 10 customers</li>
              <li>Limited reporting and analytics</li>
            </ul>
          </div>

          <div className={styles['pricing-card']}>
            <h6>Basic Plan: ₹99/month</h6>
            <ul>
              <li>Basic features</li>
              <li>Up to 50 customers</li>
              <li>Limited reporting and analytics</li>
            </ul>
          </div>
          <div className={styles['pricing-card']}>
            <h6>Pro Plan: ₹199/month</h6>
            <ul>
              <li>Advanced features</li>
              <li>Up to 200 customers</li>
              <li>Detailed reporting and analytics</li>
            </ul>
          </div>
          <div className={styles['pricing-card']}>
            <h6>Premium Plan: ₹499/month</h6>
            <ul>
              <li>Comprehensive features</li>
              <li>Unlimited customers</li>
              <li>Advanced reporting and analytics</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Features</h2>
        <p>Our software provides a range of features to help you manage your mess or parcel point more efficiently.</p>
        <ul>
          <li>Membership Management: Easily manage your member data, including contact information and payment history.</li>
          <li>Reporting and Analytics: Get detailed insights into your business performance with our reporting and analytics tools.</li>
          <li>Customer Support: Get priority support from our team of experts.</li>
        </ul>
      </section>

      <section className="why-choose-us-section">
        <h2>Why Choose Us</h2>
        <p>We're committed to providing the best mess or parcel point management solution for your business.</p>
        <ul>
          <li>Reliable and Secure: Our software is designed with security and reliability in mind.</li>
          <li>Local Support: Our support team is based locally, providing you with prompt and efficient support.</li>
          <li>Customized Solutions: Our software can be customized to fit your unique needs and requirements.</li>
        </ul>
      </section>

      <section className="faqs-section">
        <h2>FAQs</h2>
        <p>Here are some frequently asked questions about our pricing and software.</p>
        <dl>
          <dt>Q: What is the cost of the software?</dt>
          <dd>A: Our pricing plans start at ₹99/month for the Basic Plan.</dd>
          <dt>Q: What features are included in each plan?</dt>
          <dd>A: Please see our features section for a detailed list of features included in each plan.</dd>
          <dt>Q: How do I get started with the software?</dt>
          <dd>A: Simply sign up for a plan on our website and we'll guide you through the onboarding process.</dd>
        </dl>
      </section>

      <div className="cta-button">
        <a href="/signup">Get Started Today</a>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
