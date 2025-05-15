import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import Footer from '../../../organisms/Footer/Footer';
import styles from './Home.module.css';


const Home = () => {
  return (
    <div className={styles['home-wrapper']}>

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

      <section className={styles['how-it-works']}>
        <h2>How It Works</h2>
        <div className={styles['steps-container']}>
          <div className={styles['step']}>
            <div className={styles['step-number']}>1</div>
            <h3>Sign Up</h3>
            <p>Create your account and select a subscription plan that fits your business needs.</p>
          </div>
          <div className={styles['step']}>
            <div className={styles['step-number']}>2</div>
            <h3>Set Up Your Menu</h3>
            <p>Add your dishes, set prices, and customize your offerings for your customers.</p>
          </div>
          <div className={styles['step']}>
            <div className={styles['step-number']}>3</div>
            <h3>Invite Customers</h3>
            <p>Share your unique link with customers so they can browse your menu and place orders.</p>
          </div>
          <div className={styles['step']}>
            <div className={styles['step-number']}>4</div>
            <h3>Start Receiving Orders</h3>
            <p>Manage orders, track deliveries, and grow your food business with ease.</p>
          </div>
        </div>
      </section>

      <section className={styles['testimonials']}>
        <h2>What Our Users Say</h2>
        <div className={styles['testimonial-container']}>
          <div className={styles['testimonial-card']}>
            <div className={styles['testimonial-content']}>
              <p>"Pack and Plate has transformed how I manage my mess business. The automated attendance tracking saves me hours every week!"</p>
            </div>
            <div className={styles['testimonial-author']}>
              <div className={styles['testimonial-avatar']}></div>
              <div className={styles['testimonial-info']}>
                <h4>Rahul Sharma</h4>
                <p>Mess Owner, Mumbai</p>
              </div>
            </div>
          </div>
          <div className={styles['testimonial-card']}>
            <div className={styles['testimonial-content']}>
              <p>"As a customer, I love being able to see the menu in advance and manage my subscription easily. The interface is so intuitive!"</p>
            </div>
            <div className={styles['testimonial-author']}>
              <div className={styles['testimonial-avatar']}></div>
              <div className={styles['testimonial-info']}>
                <h4>Priya Patel</h4>
                <p>Customer, Bangalore</p>
              </div>
            </div>
          </div>
          <div className={styles['testimonial-card']}>
            <div className={styles['testimonial-content']}>
              <p>"The analytics feature has given me insights I never had before. I've been able to optimize my menu and increase profits by 30%."</p>
            </div>
            <div className={styles['testimonial-author']}>
              <div className={styles['testimonial-avatar']}></div>
              <div className={styles['testimonial-info']}>
                <h4>Amit Verma</h4>
                <p>Restaurant Owner, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles['faq']}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles['faq-container']}>
          <div className={styles['faq-item']}>
            <h3>What is Pack and Plate?</h3>
            <p>Pack and Plate is a comprehensive management system for mess owners, tiffin services, and food subscription businesses. It helps you manage customers, track attendance, handle payments, and grow your business.</p>
          </div>
          <div className={styles['faq-item']}>
            <h3>How much does it cost?</h3>
            <p>We offer flexible pricing plans starting from ₹999/month. You can choose a plan based on your business size and requirements. Visit our pricing page for more details.</p>
          </div>
          <div className={styles['faq-item']}>
            <h3>Can I try before I subscribe?</h3>
            <p>Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.</p>
          </div>
          <div className={styles['faq-item']}>
            <h3>How do customers use the system?</h3>
            <p>Customers can access your menu, place orders, manage their subscriptions, and make payments through a user-friendly interface. They can use it on any device with a web browser.</p>
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