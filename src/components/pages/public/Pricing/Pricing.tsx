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
