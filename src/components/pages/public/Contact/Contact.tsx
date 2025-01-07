import React from 'react';
import './Contact.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';

const Contact: React.FC = () => {
  return (
    <div className="contact-container">
      <PublicNavigation />

      <section className="hero-section">
        <h1>Have a Question or Need Support?</h1>
        <h2>Contact us and we'll be happy to help.</h2>
        <img src="path/to/your/image.jpg" alt="Customer Support" />
      </section>

      <section className="contact-information-section">
        <h2>Contact Details</h2>
        <p>Address: Packandplate HQ, [Insert Address]</p>
        <p>Phone Number: +[Insert Phone Number]</p>
        <p>Email: [Insert Email]</p>
        <p>Working Hours: [Insert Working Hours]</p>
      </section>

      <section className="contact-form-section">
        <h2>Send Us a Message</h2>
        <p>Have a question or need support? Fill out the form below and we'll get back to you as soon as possible.</p>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" required></textarea>

          <button type="submit">Send Message</button>
        </form>
      </section>

      <section className="social-media-links-section">
        <h2>Follow Us on Social Media</h2>
        <p>Stay up-to-date with the latest news and updates from Packandplate.</p>
        <ul>
          <li><a href="[Insert Facebook Link]">Facebook</a></li>
          <li><a href="[Insert Twitter Link]">Twitter</a></li>
          <li><a href="[Insert LinkedIn Link]">LinkedIn</a></li>
          <li><a href="[Insert Instagram Link]">Instagram</a></li>
        </ul>
      </section>

      <section className="trust-badges-section">
        <h2>Trusted by Our Customers</h2>
        <p>Our customers trust us to provide the best mess or parcel point management solution.</p>
        <div className="trust-badges">
          <img src="path/to/secure-payment-badge.jpg" alt="Secure Payment" />
          <img src="path/to/customer-support-badge.jpg" alt="Customer Support" />
          <img src="path/to/data-protection-badge.jpg" alt="Data Protection" />
        </div>
      </section>

      <section className="address-map-section">
        <h2>Find Us on the Map</h2>
        <p>Our address on the map.</p>
        <iframe src="[Insert Map Embed]" title="Packandplate Location" width="600" height="450"></iframe>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
