import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../../../services/userService';
import styles from './Signup.module.css';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
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
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        try {
            const response = await signup(formData.username, formData.email, formData.password) as { message: string };
            setMessage(response.message);
            alert('User signup successful');
            navigate('/login');
        } catch (error) {
            setMessage('Error signing up');
        }
    };

    const redirectTo = (path: string) => {
        return () => navigate(path);
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupFormContainer}>
                <h3 className={styles.title}>Sign Up for Pack and Plate</h3>
                <p>
                    Start your 30-day free trial and experience the benefits of using Pack and Plate.
                </p>
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
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>
                    <div className={styles.formGroupContainer}>
                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            />
                        </div>
                    </div>
                    <div className={styles.loginContainer}>
                        <span>Already have an account?</span>
                        <a href="#" onClick={redirectTo('/login')}>Login</a>
                    </div>

                    <button type="submit" className={styles.button}>
                        Sign Up
                    </button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
            <div className={styles.imgContainer}>
                <img src={require('../../../../assets/images/signup-background.jpg')} alt="Signup background" />
            </div>
        </div>
    );
};

export default Signup;
