import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import styles from './FeatureRequest.module.css'

const FeatureRequest = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        featureTitle: '',
        featureDescription: '',
        userType: 'customer' // Default user type
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Feature request submitted:', formData);
        // Here you would typically send the data to your backend
        // For now, we'll just show a success message
        setSubmitted(true);
    };

    return (
        <div className={styles['feature-request-container']}>
            <PublicNavigation />

            <div className={styles['form-container']}>
                {!submitted ? (
                    <>
                        <h5>Help Shape the Future of Pack and Plate</h5>
                        <p className={styles['form-description']}>
                            We value your input! Share your ideas for new features that would make Pack and Plate better for you.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className={styles['feature-form-field']}>
                                <label>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles['feature-form-field']}>
                                <label>
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles['feature-form-field']}>
                                <label>
                                    User Type
                                </label>
                                <select
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="member">Member (Food Provider)</option>
                                    <option value="potential">Potential User</option>
                                </select>
                            </div>

                            <div className={styles['feature-form-field']}>
                                <label>
                                    Feature Title
                                </label>
                                <input
                                    type="text"
                                    name="featureTitle"
                                    value={formData.featureTitle}
                                    onChange={handleChange}
                                    required
                                    placeholder="A brief title for your feature idea"
                                />
                            </div>

                            <div className={styles['feature-form-field']}>
                                <label>
                                    Feature Description
                                </label>
                                <textarea
                                    name="featureDescription"
                                    value={formData.featureDescription}
                                    onChange={handleChange}
                                    rows={6}
                                    required
                                    placeholder="Please describe your feature idea in detail. How would it work? Why is it important to you?"
                                />
                            </div>

                            <div className={styles['terms-agreement']}>
                                <p>
                                    By submitting this form, you agree to our <Link to="/feature-request-terms">Feature Request Terms</Link>.
                                </p>
                            </div>

                            <button type="submit" className="primary-button">Submit Feature Request</button>
                        </form>
                    </>
                ) : (
                    <div className={styles['success-message']}>
                        <h5>Thank You for Your Suggestion!</h5>
                        <p>
                            We've received your feature request and appreciate your input. Our team will review your suggestion and consider it for future updates.
                        </p>
                        <p>
                            If we need more information, we'll contact you at the email address you provided.
                        </p>
                        <button
                            onClick={() => {
                                setFormData({
                                    name: '',
                                    email: '',
                                    featureTitle: '',
                                    featureDescription: '',
                                    userType: 'customer'
                                });
                                setSubmitted(false);
                            }}
                            className="primary-button"
                        >
                            Submit Another Request
                        </button>
                    </div>
                )}
            </div>

            <NewsletterSubscription/>
            <Footer />
        </div>
    );
};

export default FeatureRequest;
