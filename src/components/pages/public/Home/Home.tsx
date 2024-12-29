import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import './Home.module.css';

const Home = () => {
  return (
    <div>
      <PublicNavigation />
      <section className="hero">
        <h2>Start Your Culinary Journey</h2>
        <p>Discover the benefits of using Pack and Plate, and sign up for a parcel point today.</p>
        <button>Sign Up</button>
        <button>Explore Membership Options</button>
      </section>

      <section className="value-proposition">
        <h2>Why Choose Pack and Plate?</h2>
        <article>
          <h3>Convenience</h3>
          <p>Manage your monthly memberships in one place.</p>
          <button>Learn More</button>
        </article>
        <article>
          <h3>Easy Integration</h3>
          <p>Integrate Pack and Plate with your existing website or app.</p>
          <button>Learn More</button>
        </article>
        <article>
          <h3>Clear Analytics</h3>
          <p>View your membership metrics in one place.</p>
          <button>Learn More</button>
        </article>
      </section>

      <section className="feature-highlights">
        <h2>Key Features</h2>
        <div>
          <h3>Customizable Plans</h3>
          <p>Create plans that fit your business needs.</p>
          <button>Learn More</button>
        </div>
        <div>
          <h3>Automated Notifications</h3>
          <p>Automate membership notifications and reminders.</p>
          <button>Learn More</button>
        </div>
        <div>
          <h3>Insights and Analytics</h3>
          <p>Track your membership metrics and make data-driven decisions.</p>
          <button>Learn More</button>
        </div>
      </section>    
    </div>
  );
};

export default Home;
export {};