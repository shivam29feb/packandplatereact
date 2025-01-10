import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import './TermsAndConditions.module.css';

const TermsAndConditions = () => {
    return (
        <div className="terms-and-conditions">
            <PublicNavigation />
            <div className="terms-and-conditions-content">
                <h1>Terms and Conditions</h1>
                <p>Last updated: March 15, 2023</p>
                <p>
                    Please read these terms and conditions carefully before using Our Service.
                </p>
                <h2>Interpretation and Definitions</h2>
                <p>
                    The words of which the initial letter is capitalized have meanings defined under the following conditions.
                    The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                </p>
                <h2>Acknowledgement</h2>
                <p>
                    These Terms and Conditions ("Terms", "Terms and Conditions") govern your relationship with
                    [website URL] website (the "Website") and Pack and Plate mobile application (the "Application")
                    operated by Pack and Plate ("us", "we", or "our").
                </p>
                <p>
                    Please read these Terms and Conditions carefully before using the Website and/or Application.
                </p>
                <p>
                    Your access to and use of the Website and/or Application is conditioned on your acceptance of and compliance
                    with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access
                    or use the Website and/or Application.
                </p>
                <h2>Links to Other Websites</h2>
                <p>
                    Our Service may contain links to third-party web sites or services that are not owned or controlled by Pack and Plate.
                </p>
                <p>
                    Pack and Plate has no control over, and assumes no responsibility for, the content, privacy policies, or practices
                    of any third party web sites or services. You further acknowledge and agree that Pack and Plate shall not be
                    responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in
                    connection with use of or reliance on any such content, goods or services available on or through any such web
                    sites or services.
                </p>
                <h2>Governing Law</h2>
                <p>
                    These Terms and Conditions shall be governed and construed in accordance with the laws of State and/or country
                    without regard to its conflict of law provisions.
                </p>
                <h2>Changes to These Terms and Conditions</h2>
                <p>
                    We reserve the right, at Our sole discretion, to modify or replace these Terms and Conditions at any time.
                    If a revision is material We will try to provide at least 30 days' notice prior to any new terms taking effect.
                    What constitutes a material change will be determined at Our sole discretion.
                </p>
                <h2>Contact Us</h2>
                <p>
                    If you have any questions about these Terms and Conditions, You can contact us:
                </p>
                <ul>
                    <li>By email: [info@packandplate.com](mailto:info@packandplate.com)</li>
                </ul>
            </div>
            <Footer />
        </div>
    );
};

export default TermsAndConditions;
