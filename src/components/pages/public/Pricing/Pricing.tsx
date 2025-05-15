import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Pricing.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'common',
      name: 'Common',
      price: 0,
      features: [
        'Limited features',
        'Up to 10 customers',
        'Limited reporting and analytics'
      ],
      popular: false
    },
    {
      id: 'rare',
      name: 'Rare',
      price: 99,
      features: [
        'Basic features',
        'Up to 50 customers',
        'Limited reporting and analytics'
      ],
      popular: false
    },
    {
      id: 'epic',
      name: 'Epic',
      price: 199,
      features: [
        'Advanced features',
        'Up to 200 customers',
        'Detailed reporting and analytics'
      ],
      popular: true
    },
    {
      id: 'legendary',
      name: 'Legendary',
      price: 499,
      features: [
        'Comprehensive features',
        'Unlimited customers',
        'Advanced reporting and analytics'
      ],
      popular: false
    }
  ];

  const formatPrice = (price: number): string => {
    return `₹${price}/month`;
  };

  const handleSelectPlan = (planId: string) => {
    // If user is logged in, go to checkout
    // Otherwise, go to registration with plan pre-selected
    navigate(`/signup?plan=${planId}`);
  };

  return (
    <div className="pricing-container">
      <PublicNavigation />

      <section className={styles.heroSection}>
        <h1>Get the Right Plan for Your Business</h1>
        <h2>Our pricing plans are designed to fit your needs, whether you're a small or large mess or parcel point.</h2>
      </section>

      <section className={styles.pricingSection}>
        <div className={styles.pricingPlans}>
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`${styles.pricingPlan} ${plan.popular ? styles.popular : ''}`}
            >
              <h2>{plan.name}</h2>
              <div className={styles.planPrice}>
                <h3>{formatPrice(plan.price)}</h3>
              </div>
              <ul className={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button
                className={styles.selectPlanBtn}
                onClick={() => handleSelectPlan(plan.id)}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.featuresSection} id="features">
        <h2>Features</h2>
        <p>Our software provides a range of features to help you manage your mess or parcel point more efficiently</p>
        <ul className={styles.featuresList}>
          <li className={styles.featureItem}>
            <strong>Membership Management</strong>
            <p>Easily manage your member data, including contact information and payment history. Keep track of all your customers in one place.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Reporting and Analytics</strong>
            <p>Get detailed insight into your business performance with our reporting and analytics tools. Make data-driven decisions to grow your business.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Customer Support</strong>
            <p>Get priority support from our team of experts who are available to help you with any questions or issues you may have.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Menu Planning</strong>
            <p>Create and manage your menu plans easily. Let your customers know what's on the menu in advance.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Attendance Tracking</strong>
            <p>Track customer attendance and manage daily meal counts with our intuitive system. No more manual record keeping.</p>
          </li>
          <li className={styles.featureItem}>
            <strong>Payment Processing</strong>
            <p>Accept payments online and keep track of all transactions. Automated reminders for due payments.</p>
          </li>
        </ul>
      </section>

      <section className={styles.whyChooseUsSection} id="why-choose-us">
        <h2>Why Choose Us</h2>
        <p>We're committed to providing the best mess or parcel point management solution for your business.</p>
        <ul className={styles.whyChooseUsList}>
          <li className={styles.whyChooseUsItem}>
            <div className={styles.whyChooseUsIcon}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className={styles.whyChooseUsContent}>
              <strong>Reliable and Secure</strong>
              <p>Our software is designed with security and reliability in mind, ensuring your data is always safe and accessible.</p>
            </div>
          </li>
          <li className={styles.whyChooseUsItem}>
            <div className={styles.whyChooseUsIcon}>
              <i className="fas fa-headset"></i>
            </div>
            <div className={styles.whyChooseUsContent}>
              <strong>Local Support</strong>
              <p>Our support team is based locally, providing you with prompt and efficient support whenever you need it.</p>
            </div>
          </li>
          <li className={styles.whyChooseUsItem}>
            <div className={styles.whyChooseUsIcon}>
              <i className="fas fa-cogs"></i>
            </div>
            <div className={styles.whyChooseUsContent}>
              <strong>Customized Solutions</strong>
              <p>Our software can be customized to fit your unique needs and requirements, adapting to your business model.</p>
            </div>
          </li>
        </ul>
      </section>

      <section className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqContainer}>
          <div className={styles.faqItem}>
            <h3>What happens after my free trial?</h3>
            <p>After your 14-day free trial ends, your selected plan will automatically begin. You can cancel anytime during the trial period without being charged.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Can I change plans later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your billing cycle.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, debit cards, UPI, and net banking through our secure payment gateway.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Is there a setup fee?</h3>
            <p>No, there are no setup fees or hidden charges. You only pay the advertised price for your subscription.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>How do I get started with the software?</h3>
            <p>Simply sign up for a plan on our website and we'll guide you through the onboarding process. All plans include a 14-day free trial.</p>
          </div>
        </div>
      </section>

      <div className="cta-button">
        <a href="/signup">Get Started Today</a>
      </div>

      <NewsletterSubscription/>
      <Footer />
    </div>
  );
};

export default Pricing;
