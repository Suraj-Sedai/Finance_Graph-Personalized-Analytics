import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Change the URL if necessary (for example, using SimpleJWT, it might be /api/token/)
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      // Save token and username to localStorage
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('username', username);
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials and try again.');
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
        <button className="form_button" type="submit">
          Login
        </button>
        <p className="form_text">
          Don't have an account?{' '}
          <a href="/signup" className="form_link">
            Create new
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
