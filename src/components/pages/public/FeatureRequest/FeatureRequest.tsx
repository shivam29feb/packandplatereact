import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import './FeatureRequest.module.css';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';

const FeatureRequest = () => {
    return (
        <div className="featureRequestContainer">

            <PublicNavigation />

            

            <h1>Feature Request</h1>
            <p>
                If you have any feature request, please fill out the form below and we will get back to you as soon as possible.
            </p>
            <form>
                <label>
                    Name:
                    <input type="text" name="name" />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Feature Request:
                    <textarea name="featureRequest" />
                </label>
                <input type="submit" value="Submit" />
            </form>

            <NewsletterSubscription/>
            <Footer />
        </div>
    );
};

export default FeatureRequest;
