import React, { useState } from 'react';
import api from '../api';  // Import your axios instance for API calls
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // For navigation after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending the login request to the backend
            const response = await api.post('/token/', {  
                username,
                password
            });

            // Handle successful login
            alert('Login successful!');
            console.log('JWT Token:', response.data.access);  // Log the JWT token (optional)
            
            // Save the token and username to localStorage
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('username', username);

            // Redirect to the home page after successful login
            navigate('/home');  
        } catch (error) {
            // Handle login failure
            console.error('Error logging in:', error);
            //alert('Login failed, please check your credentials.');
        }
    };

    return (
        <div className="login_container">
            <form className="login_form" onSubmit={handleSubmit}>
                <h2 className="form_heading">Login</h2>
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
                <button className="form_button" type="submit">Login</button>
                <p className="form_text">
                    Don't have an account? <a href="/signup" className="form_link">Create new</a>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
