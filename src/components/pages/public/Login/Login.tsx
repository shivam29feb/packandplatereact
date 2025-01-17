import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../services/loginService';
import styles from './Login.module.css';
import PublicNavigation from '../../../molecules/PublicNavigation/PublicNavigation';
import Footer from '../../../organisms/Footer/Footer';
import NewsletterSubscription from '../../../molecules/NewsletterSubscription/NewsletterSubscription';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await login(formData.email, formData.password) as { message: string };
            setMessage(response.message);
            alert('Login successful');
            navigate('/member/dashboard');
        } catch (error) {
            setMessage('Error logging in');
        }
    };

    const redirectTo = (path: string) => {
        return () => navigate(path);
    };

    return (
        <div>
            <PublicNavigation />
            <div className={styles.loginContainer}>
                <div className={styles.loginFormContainer}>
                    <h3 className={styles.title}>Login to Pack and Plate</h3>
                    <p>
                        Welcome back! Please login to your account.
                    </p>
                    <form onSubmit={handleSubmit}>
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
                        <div className={styles.formGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.signupContainer}>
                            <span>Don't have an account?</span>
                            <span onClick={redirectTo('/signup')}>Sign up</span>
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            Login
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

export default Login;
