import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import Button from '../../../atoms/Button/Button';
import styles from './FeatureRequest.module.css';

interface FormData {
    name: string;
    email: string;
    featureTitle: string;
    featureDescription: string;
    userType: string;
    priority: string;
    useCase: string;
    category: string;
    agreeToTerms: boolean;
}

interface Category {
    id: string;
    label: string;
}

interface Priority {
    id: string;
    label: string;
    color: string;
}

// Icons
const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const FeatureIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const FeatureRequest: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        featureTitle: '',
        featureDescription: '',
        userType: 'customer',
        priority: 'medium',
        useCase: '',
        category: 'feature',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    
    const categories: Category[] = [
        { id: 'feature', label: 'New Feature' },
        { id: 'improvement', label: 'Improvement' },
        { id: 'bug', label: 'Bug Fix' },
        { id: 'other', label: 'Other' }
    ];
    
    const priorities: Priority[] = [
        { id: 'low', label: 'Low', color: 'var(--success-color)' },
        { id: 'medium', label: 'Medium', color: 'var(--warning-color)' },
        { id: 'high', label: 'High', color: 'var(--danger-color)' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Name is required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }
        }
        
        if (step === 2) {
            if (!formData.featureTitle.trim()) newErrors.featureTitle = 'Title is required';
            if (!formData.featureDescription.trim()) {
                newErrors.featureDescription = 'Description is required';
            } else if (formData.featureDescription.length < 20) {
                newErrors.featureDescription = 'Description should be at least 20 characters';
            }
        }
        
        if (step === 3 && !formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;
        
        if (currentStep < totalSteps) {
            nextStep();
            return;
        }
        
        try {
            setIsSubmitting(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting feature request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => {
            const prevStep = Math.max(prev - 1, 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return prevStep;
        });
    };
    
    const goToStep = (step: number) => {
        if (step < currentStep) {
            setCurrentStep(step);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { number: 1, label: 'Your Info' },
            { number: 2, label: 'Feature Details' },
            { number: 3, label: 'Review' }
        ];
        
        return (
            <div className={styles.stepIndicator}>
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.number;
                    const isActive = currentStep === step.number;
                    const stepClass = [
                        styles.step,
                        isActive ? styles.active : '',
                        isCompleted ? styles.completed : ''
                    ].join(' ');
                    
                    return (
                        <div 
                            key={step.number} 
                            className={stepClass}
                            onClick={() => goToStep(step.number)}
                        >
                            <div className={styles.stepNumber}>
                                {isCompleted ? <CheckIcon /> : step.number}
                            </div>
                            <span className={styles.stepLabel}>{step.label}</span>
                            {index < steps.length - 1 && <div className={styles.stepConnector} />}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className={styles['form-step']}>
                        <div className={styles['form-field']}>
                            <label htmlFor="name">Your Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                            {errors.name && <span className={styles['error-message']}>{errors.name}</span>}
                        </div>

                        <div className={styles['form-field']}>
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                            {errors.email && <span className={styles['error-message']}>{errors.email}</span>}
                        </div>

                        <div className={styles['form-field']}>
                            <label>You are a:</label>
                            <div className={styles['radio-group']}>
                                <label className={styles['radio-label']}>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="customer"
                                        checked={formData.userType === 'customer'}
                                        onChange={handleChange}
                                    />
                                    <span>Customer</span>
                                </label>
                                <label className={styles['radio-label']}>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="member"
                                        checked={formData.userType === 'member'}
                                        onChange={handleChange}
                                    />
                                    <span>Member</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className={styles['form-step']}>
                        <div className={styles['form-field']}>
                            <label htmlFor="featureTitle">Feature Title *</label>
                            <input
                                type="text"
                                id="featureTitle"
                                name="featureTitle"
                                value={formData.featureTitle}
                                onChange={handleChange}
                                placeholder="A clear, concise title for your feature"
                                required
                            />
                            {errors.featureTitle && <span className={styles['error-message']}>{errors.featureTitle}</span>}
                        </div>

                        <div className={styles['form-field']}>
                            <label>Category</label>
                            <div className={styles['button-group']}>
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        className={`${styles['category-button']} ${formData.category === category.id ? styles.active : ''}`}
                                        onClick={() => setFormData(prev => ({
                                            ...prev,
                                            category: category.id
                                        }))}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles['form-field']}>
                            <label htmlFor="featureDescription">Description *</label>
                            <textarea
                                id="featureDescription"
                                name="featureDescription"
                                value={formData.featureDescription}
                                onChange={handleChange}
                                placeholder="Please describe the feature in detail. What problem does it solve? How should it work?"
                                required
                            />
                            {errors.featureDescription && <span className={styles['error-message']}>{errors.featureDescription}</span>}
                        </div>

                        <div className={styles['form-field']}>
                            <label>Priority</label>
                            <div className={styles['priority-group']}>
                                {priorities.map(priority => (
                                    <label 
                                        key={priority.id}
                                        className={styles['priority-label']}
                                        style={{
                                            '--priority-color': priority.color
                                        } as React.CSSProperties}
                                    >
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={priority.id}
                                            checked={formData.priority === priority.id}
                                            onChange={handleChange}
                                        />
                                        <span className={styles['priority-button']}>
                                            {priority.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );
                
            case 3:
                return (
                    <div className={styles['form-step']}>
                        <h5>Review your request</h5>
                        <p className={styles['subheader']}>Please review your information before submitting.</p>

                        <div className={styles['review-section']}>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>Name</span>
                                <span className={styles['review-value']}>{formData.name}</span>
                            </div>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>Email</span>
                                <span className={styles['review-value']}>{formData.email}</span>
                            </div>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>User Type</span>
                                <span className={styles['review-value']}>
                                    {formData.userType === 'customer' ? 'Customer' : 'Member'}
                                </span>
                            </div>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>Feature Title</span>
                                <span className={styles['review-value']}>{formData.featureTitle || '-'}</span>
                            </div>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>Category</span>
                                <span className={styles['review-value']}>
                                    {categories.find(c => c.id === formData.category)?.label || '-'}
                                </span>
                            </div>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>Priority</span>
                                <span className={styles['review-value']}>
                                    {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                                </span>
                            </div>
                            <div className={styles['review-row']}>
                                <span className={styles['review-label']}>Description</span>
                                <div className={styles['review-text']}>
                                    {formData.featureDescription || 'No description provided'}
                                </div>
                            </div>
                            
                            <div className={`${styles['form-field']} ${errors.agreeToTerms ? styles.error : ''}`}>
                                <label className={styles['checkbox-label']}>
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                    />
                                    I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                                </label>
                                {errors.agreeToTerms && (
                                    <span className={styles['error-message']}>{errors.agreeToTerms}</span>
                                )}
                            </div>
                        </div>

                        <div className={styles['form-actions']}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={prevStep}
                                className={styles.button}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting || (currentStep === 3 && !formData.agreeToTerms)}
                                className={styles.button}
                            >
                                {isSubmitting ? 'Submitting...' : currentStep === 3 ? 'Submit Request' : 'Continue'}
                            </Button>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    const renderNavigation = () => {
        if (submitted) {
            return (
                <div className={styles['submission-success']}>
                    <div className={styles['success-icon']}>
                        <CheckIcon />
                    </div>
                    <h2>Thank you for your feedback!</h2>
                    <p>We've received your feature request and will review it shortly.</p>
                    <Link to="/" className={styles['home-link']}>
                        <Button variant="primary">Back to Home</Button>
                    </Link>
                </div>
            );
        }

        return (
            <form onSubmit={handleSubmit}>
                {renderStepIndicator()}
                {renderFormStep()}
            </form>
        );
    };

    return (
        <div className={styles['feature-request-container']}>
            <PublicNavigation />
            <div className={styles['form-container']}>
                <div className={styles['feature-request-form-container']}>
                    <div className={styles.header}>
                        <div className={styles.icon}>
                            <FeatureIcon />
                        </div>
                        <h1>Request a Feature</h1>
                        <p>Have an idea to improve our platform? Let us know below!</p>
                    </div>
                    {renderNavigation()}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FeatureRequest;
