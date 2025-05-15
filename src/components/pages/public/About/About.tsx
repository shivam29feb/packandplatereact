import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles['about-wrapper']}>
      <PublicNavigation />

      {/* Hero Section */}
      <section className={styles['hero-section']}>
        <div className={styles['hero-content']}>
          <h1>About Pack and Plate</h1>
          <h6>We're on a mission to revolutionize how mess owners and food subscription businesses manage their operations and connect with customers.</h6>
          <button className={styles['hero-button']}>Get Started</button>
        </div>
      </section>

      {/* Our Story Section */}
      <section className={styles['our-story-section']}>
        <div className={styles['section-header']}>
          <h2>Our Story</h2>
        </div>
        <div className={styles['our-story-content']}>
          <div className={styles['our-story-text']}>
            <p>Pack and Plate was born out of a simple observation: mess owners and food subscription businesses were struggling with outdated management systems that didn't meet their unique needs.</p>
            <p>Founded in 2023, our team set out to create a comprehensive solution that would streamline operations, improve customer experiences, and help these businesses grow.</p>
            <p>What started as a simple attendance tracking tool has evolved into a full-featured platform that handles everything from membership management to menu planning and analytics.</p>
          </div>
          <div className={styles['our-story-image']}>
            <div className={styles['image-placeholder']}></div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className={styles['what-we-do-section']}>
        <div className={styles['what-we-do-inner']}>
          <div className={styles['section-header']}>
            <h2>What We Do</h2>
          </div>
          <div className={styles['what-we-do-content']}>
            <p>We provide a comprehensive platform that helps mess owners and food subscription businesses manage their operations efficiently and deliver exceptional experiences to their customers.</p>
          </div>
          <div className={styles['features-grid']}>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Attendance Tracking</h3>
              <p>Easily track customer attendance and manage daily meal counts with our intuitive system.</p>
            </div>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Menu Management</h3>
              <p>Create and share your menu with customers, allowing them to plan their meals in advance.</p>
            </div>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Business Analytics</h3>
              <p>Gain valuable insights into your business performance with detailed analytics and reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className={styles['our-mission-section']}>
        <div className={styles['section-header']}>
          <h2>Our Mission</h2>
        </div>
        <div className={styles['mission-content']}>
          <div className={styles['mission-image']}>
            <div className={styles['image-placeholder']}></div>
          </div>
          <div className={styles['mission-text']}>
            <p>Our mission is to empower mess owners and food subscription businesses with the tools they need to thrive in today's competitive market.</p>
            <p>We believe that by streamlining operations and improving customer experiences, these businesses can focus on what they do best: creating delicious, nutritious meals for their communities.</p>
            <p>Through innovation, dedication, and a deep understanding of our customers' needs, we aim to be the leading platform for food subscription management worldwide.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles['team-section']}>
        <div className={styles['team-inner']}>
          <div className={styles['section-header']}>
            <h2>Meet Our Team</h2>
          </div>
          <div className={styles['team-content']}>
            <p>We're a passionate team of food enthusiasts, tech experts, and business innovators working together to transform the food subscription industry.</p>
          </div>
          <div className={styles['team-grid']}>
            <div className={styles['team-member']}>
              <div className={styles['member-photo']}></div>
              <h3>Rahul Sharma</h3>
              <p>Founder & CEO</p>
            </div>
            <div className={styles['team-member']}>
              <div className={styles['member-photo']}></div>
              <h3>Priya Patel</h3>
              <p>Chief Technology Officer</p>
            </div>
            <div className={styles['team-member']}>
              <div className={styles['member-photo']}></div>
              <h3>Amit Verma</h3>
              <p>Head of Product</p>
            </div>
            <div className={styles['team-member']}>
              <div className={styles['member-photo']}></div>
              <h3>Neha Singh</h3>
              <p>Customer Success Lead</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles['values-section']}>
        <div className={styles['section-header']}>
          <h2>Our Values</h2>
        </div>
        <div className={styles['values-grid']}>
          <div className={styles['value-card']}>
            <h3>Innovation</h3>
            <p>We constantly seek new ways to improve our platform and solve our customers' challenges.</p>
          </div>
          <div className={styles['value-card']}>
            <h3>Reliability</h3>
            <p>We build dependable systems that our customers can count on every day.</p>
          </div>
          <div className={styles['value-card']}>
            <h3>Simplicity</h3>
            <p>We believe in making complex processes simple and intuitive for all users.</p>
          </div>
          <div className={styles['value-card']}>
            <h3>Community</h3>
            <p>We foster connections between food providers and their customers, strengthening communities.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles['cta-section']}>
        <div className={styles['cta-content']}>
          <h2>Ready to Transform Your Food Business?</h2>
          <p>Join thousands of mess owners and food subscription businesses who are growing their operations with Pack and Plate.</p>
          <button className={styles['cta-button']}>Get Started Today</button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
