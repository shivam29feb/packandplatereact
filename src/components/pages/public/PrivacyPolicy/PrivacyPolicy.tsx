import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <div>
      <PublicNavigation />
      <div className={styles['privacyPolicyContainer'] }>
        <h1>Privacy Policy</h1>
        <p>This privacy policy sets out how Pack and Plate uses and protects any information that you give Pack and Plate when you use this website.</p>
        <p>Pack and Plate is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.</p>
        <p>Pack and Plate may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 1st January 2022.</p>
        <h2>Information collection</h2>
        <p>We may collect the following information:</p>
        <ul>
          <li>Name and job title</li>
          <li>Contact information including email address</li>
          <li>Demographic information such as postcode, preferences and interests</li>
          <li>Other information relevant to customer surveys and/or offers</li>
        </ul>
        <h2>What we do with the information we gather</h2>
        <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
        <ul>
          <li>Internal record keeping</li>
          <li>We may use the information to improve our products and services</li>
          <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided</li>
          <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests</li>
        </ul>
        <h2>Security</h2>
        <p>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.</p>
        <h2>Controlling your personal information</h2>
        <p>You may choose to restrict the collection or use of your personal information in the following ways:</p>
        <ul>
          <li>Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</li>
          <li>If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at <a href="mailto:info@packandplate.com">info@packandplate.com</a></li>
        </ul>
        <h2>Links to other websites</h2>
        <p>Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.</p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
