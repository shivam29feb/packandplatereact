import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../../../services/userService';
import './Signup.css';


const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        console.log('Form Data:', formData);
        console.log('Form Data before sending:', formData);
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
        <div className='signup-container'>
            <div className="signup-form-container">
                <h3>Sign Up for Pack and Plate</h3>
                <p>
                    Start your 30-day free trial and experience the benefits of using Pack and Plate.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-container">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    </div>
                    <div className="form-group-container">
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    </div>
                    <div className="login-container">
                        <span>Already have an account?</span>
                        <a href="#" onClick={redirectTo('/login')}>Login</a>
                    </div>



                    <button type="submit" className="submit-button">
                        Sign Up
                    </button>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div className="img-container">
                <img src={require('../../../../assets/images/signup-background.jpg')} alt="Signup background" />
            </div>
        </div>
    );
};

export default Signup;
