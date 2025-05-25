import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signup } from '../../../../services/userService';
import styles from './Signup.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';
import Footer from '../../../organisms/Footer/Footer';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get plan and billing cycle from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const planFromUrl = queryParams.get('plan');
    const billingFromUrl = queryParams.get('billing');

    // Subscription plans data
    const plans = [
        {
            id: 'common',
            name: 'Common',
            price: 0,
            features: [
                'Limited features',
                'Up to 10 customers',
                'Limited reporting and analytics'
            ]
        },
        {
            id: 'rare',
            name: 'Rare',
            price: 99,
            features: [
                'Basic features',
                'Up to 50 customers',
                'Limited reporting and analytics'
            ]
        },
        {
            id: 'epic',
            name: 'Epic',
            price: 199,
            features: [
                'Advanced features',
                'Up to 200 customers',
                'Detailed reporting and analytics'
            ]
        },
        {
            id: 'legendary',
            name: 'Legendary',
            price: 499,
            features: [
                'Comprehensive features',
                'Unlimited customers',
                'Advanced reporting and analytics'
            ]
        }
    ];

    // setting empty form data state using setFormData function
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        businessName: '',
        userType: 'member', // Default to member since we're signing up with a subscription
        plan: planFromUrl || 'epic' // Default to Epic plan if none selected
    });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Format price with Indian Rupee symbol
    const formatPrice = (price: number): string => {
        return `₹${price}/month`;
    };

    // updating formData values using setFormData function and ... spread operator
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle plan selection
    const handlePlanChange = (planId: string) => {
        setFormData({
            ...formData,
            plan: planId
        });
    };

    // No billing cycle change needed for this design

    // Sending the data to the service file signup function using the handleSubmit function
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        // Validate business name for member signup
        if (formData.userType === 'member' && !formData.businessName.trim()) {
            alert("Business name is required for member registration");
            return;
        }

        try {
            // In a real implementation, we would include the subscription plan details
            const response = await signup(
                formData.username,
                formData.email,
                formData.password,
                formData.userType,
                {
                    phone: formData.phone,
                    address: formData.address,
                    businessName: formData.businessName,
                    plan: formData.plan
                }
            ) as { message: string };

            setMessage(response.message);
            alert('User signup successful! You will be redirected to complete your subscription setup.');

            // In a real implementation, we would redirect to a payment page or subscription confirmation
            // For now, we'll just redirect to login
            navigate('/login');
        } catch (error) {
            setMessage('Error signing up');
        }
    };

    const redirectTo = (path: string) => {
        return () => navigate(path);
    };

    return (
        <div>
            <PublicNavigation />
            <div className={styles.signupContainer}>
                <div className={styles.signupFormContainer}>
                    <h3 className={styles.title}>Sign Up for Pack and Plate</h3>
                    <p>
                        Start your 14-day free trial and experience the benefits of using Pack and Plate.
                    </p>

                    {/* Subscription Plan Selection */}
                    <div className={styles.subscriptionSection}>
                        <h4>Selected Subscription Plan</h4>
                        <div className={styles.planSelector}>
                            {plans.map(plan => (
                                <div
                                    key={plan.id}
                                    className={`${styles.planOption} ${formData.plan === plan.id ? styles.selectedPlan : ''}`}
                                    onClick={() => handlePlanChange(plan.id)}
                                >
                                    <h5>{plan.name}</h5>
                                    <p className={styles.planPrice}>
                                        {formatPrice(plan.price)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* No billing toggle needed for this design */}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroupContainer}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroupContainer}>
                            <div className={styles.formGroup}>
                                <label htmlFor="businessName">Business Name</label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="Your mess or parcel point name"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Your contact number"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address">Business Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Your business address"
                            />
                        </div>
                        <div className={styles.formGroupContainer}>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <div className={styles.passwordInputContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                    />
                                    <i
                                        className={`${showPassword ? "fas fa-eye-slash" : "fas fa-eye"} ${styles.passwordToggle}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                    ></i>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className={styles.passwordInputContainer}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={styles.input}
                                    />
                                    <i
                                        className={`${showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"} ${styles.passwordToggle}`}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    ></i>
                                </div>
                            </div>
                        </div>
                        <div className={styles.loginContainer}>
                            <span>Already have an account?</span>
                            <span onClick={redirectTo('/login')}>Login</span>
                        </div>

                        <div className={styles.trialInfo}>
                            <p>By signing up, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
                            <p>Your 14-day free trial starts today. No credit card required.</p>
                        </div>

                        <button type="submit" className={styles.button}>
                            Start Free Trial
                        </button>
                    </form>
                    {message && <p className={styles.message}>{message}</p>}
                </div>
                <div className={styles.imgContainer}>
                    <img src={require('../../../../assets/images/signup-background.jpg')} alt="Signup background" />
                </div>

            </div>
            <NewsletterSubscription />
            <Footer />
        </div>
    );
};

export default Signup;
