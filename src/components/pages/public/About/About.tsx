import React from 'react';
import './About.module.css';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <h1>About PackandPlate</h1>
        <h2>The Ultimate Parcel Point and Mess Management System</h2>
        <p>Welcome to PackandPlate, the ultimate solution for parcel point and mess management designed specifically for mess owners and parcel point administrators.</p>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Create & Manage Dishes</h3>
            <p>Effortlessly manage your dishes with our intuitive interface. Whether you need to create, view, edit, or delete, doing so has never been easier.</p>
          </div>
          <div className="feature-card">
            <h3>Flexible Membership Plans</h3>
            <p>Craft tailored membership options to enhance user experiences and engagement. Our system allows you to offer, modify, and remove plans as needed.</p>
          </div>
          <div className="feature-card">
            <h3>User Management</h3>
            <p>Keep track of your users seamlessly. Our platform allows for comprehensive user management, empowering you to view, edit, and delete accounts effortlessly.</p>
          </div>
          <div className="feature-card">
            <h3>Dynamic Menu Management</h3>
            <p>Update your menu in real-time to keep offerings fresh and appealing. Encourage your users to try new dishes and maintain interest in your services.</p>
          </div>
        </div>
      </section>

      <section className="excellence-section">
        <h2>Achieve Operational Excellence</h2>
        <p>Imagine a world where managing your mess or parcel point is straightforward and efficient. With PackandPlate, you can achieve just that. Our user-friendly system ensures that you spend less time on management tasks and more time delighting your customers with delicious meals.</p>
      </section>

      <section className="success-section">
        <h2>Success Stories</h2>
        <p>Join a growing community of satisfied mess owners who have transformed their operations with PackandPlate. Experience remarkable improvements in organization, user engagement, and overall management efficiency.</p>
      </section>

      <section className="cta-section">
        <h2>Get Started Today!</h2>
        <p>Ready to revolutionize your parcel point or mess management?</p>
        <div className="cta-buttons">
          <a href="/signup" className="btn btn-primary">Start Your Free Trial</a>
          <a href="/contact" className="btn btn-secondary">Contact Us</a>
        </div>
      </section>
    </div>
  );
};

export default About;