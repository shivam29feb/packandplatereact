import React from 'react';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import './FeatureRequest.module.css';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import styles from './FeatureRequest.module.css'

const FeatureRequest = () => {
    return (
        <div className="featureRequestContainer">

            <PublicNavigation />

            
            <div className={styles['form-container']}>
                <h1>Help Shape the Future of Pack and Plate</h1>
                <p>
                    Tell Us How We Can Make Pack and Plate Better
                </p>
                <form>
                    <div className="form-fields-container">
                        <div className={styles['form-field']}>
                            <label>
                                Name:
                            </label>
                            <input type="text" name="name" />
                        </div>
                        <div className={styles['form-field']}>
                            <label>
                                Email:
                            </label>
                            <input type="email" name="email" />
                        </div>
                        <div className={styles['form-field']}>
                            <label>
                                Feature Title:
                            </label>
                            <input type="email" name="email" />
                        </div>
                        <div className={styles['form-field']}>
                            <label>
                                Feature Description:
                            </label>
                            <textarea name="featureRequest" />
                        </div>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>

            <NewsletterSubscription/>
            <Footer />
        </div>
    );
};

export default FeatureRequest;
