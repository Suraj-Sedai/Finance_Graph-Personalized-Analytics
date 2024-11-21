// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();  // useNavigate hook for redirecting

    const handleLogout = () => {
        localStorage.removeItem('token');  // Remove the token
        localStorage.removeItem('username');  // Optionally, remove username too
        navigate('/login');  // Redirect to the login page
    };

    return (
        <nav>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/add-transaction">Add Transaction</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li> {/* Logout button */}
            </ul>
        </nav>
    );
};

export default Navbar;
