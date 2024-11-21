import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',  // Your backend base URL
});

// Attach Authorization token dynamically
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Export the default axios instance
export default api;

// Define loginUser function
export const loginUser = async (username, password) => {
    try {
        const response = await api.post('/token/', {  // Assuming your backend uses /token for login
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};



