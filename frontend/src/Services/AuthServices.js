import axios from "axios";

// Base API URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export async function SignUp(userData) {
    try {
        // Match backend expected format from README
        const { data } = await api.post('/auth/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender
        });
        
        console.log('Signup response:', data);
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            return { message: 'success', data };
        } else {
            return { error: data.message || 'Registration failed' };
        }
    } catch (err) {
        console.error('Signup error:', err.response?.data);
        return { 
            error: err.response?.data?.message || 
                   err.response?.data?.errors?.[0]?.msg ||
                   'Registration failed. Please try again.' 
        };
    }
}

export async function Signin(userData) {
    try {
        const { data } = await api.post('/auth/login', {
            email: userData.email,
            password: userData.password
        });
        
        console.log('Login response:', data);
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            return { message: 'success', token: data.data.token, user: data.data.user };
        } else {
            return { error: data.message || 'Login failed' };
        }
    } catch (err) {
        console.error('Login error:', err.response?.data);
        return { 
            error: err.response?.data?.message || 
                   'Login failed. Please check your credentials.' 
        };
    }
}

export async function getCurrentUser() {
    try {
        const { data } = await api.get('/auth/me');
        
        if (data.success) {
            return { success: true, data: data.data };
        } else {
            return { success: false, error: data.message };
        }
    } catch (err) {
        console.error('Get user error:', err);
        return { success: false, error: err.response?.data?.message };
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

export default api;