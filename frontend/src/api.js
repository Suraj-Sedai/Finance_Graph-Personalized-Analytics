import axios from 'axios';


// Create an axios instance with the base URL
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',  // Replace with your backend URL
});

// Add an interceptor to include the token in headers for every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add an interceptor to handle unauthorized errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Automatically logout if unauthorized
            console.error('Unauthorized! Redirecting to login.');
            localStorage.removeItem('token');  // Clear the token
            window.location.href = '/login';  // Redirect to login page
        }
        return Promise.reject(error);
    }
);

// Export the default axios instance
export default api;

// Define a function to handle login requests
export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/token/', {
            username,
            password,
        });

        // Save the token in localStorage
        localStorage.setItem('token', response.data.access);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};

// Define a logout function to clear token and redirect
export const logoutUser = () => {
    localStorage.removeItem('token');  // Clear the token
    window.location.href = '/login';  // Redirect to login page
};
