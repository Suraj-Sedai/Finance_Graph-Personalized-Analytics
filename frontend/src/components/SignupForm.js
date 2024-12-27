import React, { useState } from 'react';
import api from '../api';  // Import your axios instance
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // For navigation after signup

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending the registration request to the backend
            const response = await api.post('/register/', {
                username,
                password
            });

            // Handle successful registration
            alert('Registration successful! Please log in.');
            navigate('/');  // Redirect to the login page
        } catch (error) {
            // Handle registration failure
            console.error('Error registering:', error);
            alert('Registration failed, please try again.');
        }
    };

    return (
        <div className="signup_container">
            <form className="signup_form" onSubmit={handleSubmit}>
                <h2 className="form_heading">Sign Up</h2>
                <input
                    className="form_input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    className="form_input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="form_button" type="submit">Sign Up</button>
                <p className="form_text">
                    Already have an account? <a href="/login" className="form_link">Log in</a>
                </p>
            </form>
        </div>
    );
};

export default SignupForm;
