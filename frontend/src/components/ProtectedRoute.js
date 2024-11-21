import React, { useEffect, useState } from 'react';  // Import hooks
import { Navigate, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // Authentication state

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // If no token, set authenticated as false and navigate to login
        if (!token) {
            setIsAuthenticated(false);
            navigate('/login');  // Redirect to login if no token
        } else {
            try {
                // Decode JWT token to extract expiry and other details
                const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token
                const isExpired = decodedToken.exp < Date.now() / 1000;  // Check if the token is expired

                if (isExpired) {
                    // Token expired, clean up and redirect
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    navigate('/login');
                } else {
                    // Token is valid, set authenticated to true
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsAuthenticated(false);
                navigate('/login');  // In case decoding fails, redirect to login
            }
        }
    }, [navigate]);

    // Return a loading state while determining authentication status
    if (isAuthenticated === null) {
        return <div>Loading...</div>;  // Optional: Show a loading spinner while authentication is checked
    }

    // If authenticated, render children, else redirect to login
    return isAuthenticated ? children : <Navigate to="/login" />;  // Use Navigate to redirect to login if not authenticated
};

export default ProtectedRoute;
