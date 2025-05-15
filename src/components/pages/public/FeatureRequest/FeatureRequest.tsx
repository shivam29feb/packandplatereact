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
        userType: 'customer', // Default user type
        priority: 'medium', // Default priority
        useCase: '' // Use case description
    });

    const [submitted, setSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

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

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const renderStepIndicator = () => {
        return (
            <div className={styles['step-indicator']}>
                {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                        key={i}
                        className={`${styles['step-dot']} ${currentStep > i ? styles['completed'] : ''} ${currentStep === i + 1 ? styles['active'] : ''}`}
                        onClick={() => setCurrentStep(i + 1)}
                    >
                        <span className={styles['step-number']}>{i + 1}</span>
                        <span className={styles['step-label']}>
                            {i === 0 ? 'Your Info' : i === 1 ? 'Feature Details' : 'Review'}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className={styles['form-step']}>
                        <h3>Tell us about yourself</h3>
                        <p>We'd like to know a bit about you to better understand your needs.</p>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="name">Your Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="userType">I am a:</label>
                            <select
                                id="userType"
                                name="userType"
                                value={formData.userType}
                                onChange={handleChange}
                                required
                            >
                                <option value="customer">Customer</option>
                                <option value="member">Member (Food Provider)</option>
                                <option value="potential">Potential User</option>
                            </select>
                        </div>

                        <div className={styles['form-navigation']}>
                            <button type="button" className={styles['next-button']} onClick={nextStep}>
                                Next <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className={styles['form-step']}>
                        <h3>Describe your feature idea</h3>
                        <p>Help us understand what you're looking for and why it matters.</p>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="featureTitle">Feature Title</label>
                            <input
                                id="featureTitle"
                                type="text"
                                name="featureTitle"
                                value={formData.featureTitle}
                                onChange={handleChange}
                                required
                                placeholder="A brief title for your feature idea"
                            />
                        </div>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="featureDescription">Feature Description</label>
                            <textarea
                                id="featureDescription"
                                name="featureDescription"
                                value={formData.featureDescription}
                                onChange={handleChange}
                                rows={4}
                                required
                                placeholder="Please describe your feature idea in detail. How would it work? Why is it important to you?"
                            />
                        </div>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="useCase">Use Case</label>
                            <textarea
                                id="useCase"
                                name="useCase"
                                value={formData.useCase}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe a specific scenario where this feature would be useful"
                            />
                        </div>

                        <div className={styles['feature-form-field']}>
                            <label htmlFor="priority">Priority Level</label>
                            <div className={styles['priority-selector']}>
                                <div
                                    className={`${styles['priority-option']} ${formData.priority === 'low' ? styles['selected'] : ''}`}
                                    onClick={() => setFormData({...formData, priority: 'low'})}
                                >
                                    <span className={styles['priority-dot']} style={{backgroundColor: '#28a745'}}></span>
                                    <span>Low</span>
                                </div>
                                <div
                                    className={`${styles['priority-option']} ${formData.priority === 'medium' ? styles['selected'] : ''}`}
                                    onClick={() => setFormData({...formData, priority: 'medium'})}
                                >
                                    <span className={styles['priority-dot']} style={{backgroundColor: '#ffc107'}}></span>
                                    <span>Medium</span>
                                </div>
                                <div
                                    className={`${styles['priority-option']} ${formData.priority === 'high' ? styles['selected'] : ''}`}
                                    onClick={() => setFormData({...formData, priority: 'high'})}
                                >
                                    <span className={styles['priority-dot']} style={{backgroundColor: '#dc3545'}}></span>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['form-navigation']}>
                            <button type="button" className={styles['back-button']} onClick={prevStep}>
                                <i className="fas fa-arrow-left"></i> Back
                            </button>
                            <button type="button" className={styles['next-button']} onClick={nextStep}>
                                Review <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={styles['form-step']}>
                        <h3>Review your submission</h3>
                        <p>Please review your information before submitting.</p>

                        <div className={styles['review-section']}>
                            <div className={styles['review-item']}>
                                <h4>Your Information</h4>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>Name:</span>
                                    <span className={styles['review-value']}>{formData.name}</span>
                                </div>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>Email:</span>
                                    <span className={styles['review-value']}>{formData.email}</span>
                                </div>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>User Type:</span>
                                    <span className={styles['review-value']}>
                                        {formData.userType === 'customer' ? 'Customer' :
                                         formData.userType === 'member' ? 'Member (Food Provider)' : 'Potential User'}
                                    </span>
                                </div>
                            </div>

                            <div className={styles['review-item']}>
                                <h4>Feature Details</h4>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>Title:</span>
                                    <span className={styles['review-value']}>{formData.featureTitle}</span>
                                </div>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>Description:</span>
                                    <span className={styles['review-value']}>{formData.featureDescription}</span>
                                </div>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>Use Case:</span>
                                    <span className={styles['review-value']}>{formData.useCase || 'Not provided'}</span>
                                </div>
                                <div className={styles['review-detail']}>
                                    <span className={styles['review-label']}>Priority:</span>
                                    <span className={styles['review-value']}>
                                        <span
                                            className={styles['priority-indicator']}
                                            style={{
                                                backgroundColor:
                                                    formData.priority === 'low' ? '#28a745' :
                                                    formData.priority === 'medium' ? '#ffc107' : '#dc3545'
                                            }}
                                        ></span>
                                        {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles['terms-agreement']}>
                            <p>
                                By submitting this form, you agree to our <Link to="/feature-request-terms">Feature Request Terms</Link>.
                            </p>
                        </div>

                        <div className={styles['form-navigation']}>
                            <button type="button" className={styles['back-button']} onClick={prevStep}>
                                <i className="fas fa-arrow-left"></i> Back
                            </button>
                            <button type="submit" className={styles['submit-button']}>
                                Submit Request <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles['feature-request-container']}>
            <PublicNavigation />

            <div className={styles['page-header']}>
                <div className={styles['header-content']}>
                    <h1>Feature Request</h1>
                    <p>Help shape the future of Pack and Plate by suggesting new features</p>
                </div>
            </div>

            <div className={styles['form-container']}>
                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        {renderStepIndicator()}
                        {renderFormStep()}
                    </form>
                ) : (
                    <div className={styles['success-message']}>
                        <div className={styles['success-icon']}>
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <h2>Thank You for Your Suggestion!</h2>
                        <p>
                            We've received your feature request and appreciate your input. Our team will review your suggestion and consider it for future updates.
                        </p>
                        <p>
                            If we need more information, we'll contact you at the email address you provided.
                        </p>
                        <div className={styles['success-actions']}>
                            <button
                                onClick={() => {
                                    setFormData({
                                        name: '',
                                        email: '',
                                        featureTitle: '',
                                        featureDescription: '',
                                        userType: 'customer',
                                        priority: 'medium',
                                        useCase: ''
                                    });
                                    setSubmitted(false);
                                    setCurrentStep(1);
                                }}
                                className={styles['submit-another-button']}
                            >
                                <i className="fas fa-plus-circle"></i> Submit Another Request
                            </button>
                            <Link to="/" className={styles['go-home-button']}>
                                <i className="fas fa-home"></i> Return to Home
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles['feature-benefits']}>
                <div className={styles['benefit-card']}>
                    <div className={styles['benefit-icon']}>
                        <i className="fas fa-lightbulb"></i>
                    </div>
                    <h3>Share Your Ideas</h3>
                    <p>Your suggestions help us build a better product for everyone</p>
                </div>
                <div className={styles['benefit-card']}>
                    <div className={styles['benefit-icon']}>
                        <i className="fas fa-comments"></i>
                    </div>
                    <h3>Get Updates</h3>
                    <p>We'll keep you informed about the status of your request</p>
                </div>
                <div className={styles['benefit-card']}>
                    <div className={styles['benefit-icon']}>
                        <i className="fas fa-users"></i>
                    </div>
                    <h3>Join Our Community</h3>
                    <p>Connect with others who share similar ideas and needs</p>
                </div>
            </div>

            <NewsletterSubscription/>
            <Footer />
        </div>
    );
};

export default FeatureRequest;
