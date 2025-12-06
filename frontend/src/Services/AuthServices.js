import axios from "axios";

// Base API URL - update this based on your deployment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const { data } = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
                    refresh: refreshToken
                });
                
                localStorage.setItem('access_token', data.access);
                originalRequest.headers.Authorization = `Bearer ${data.access}`;
                
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export async function SignUp(userData) {
    try {
        const { data } = await api.post('/users/register/', {
            first_name: userData.name.split(' ')[0],
            last_name: userData.name.split(' ').slice(1).join(' ') || userData.name.split(' ')[0],
            email: userData.email,
            password: userData.password,
            confirm_password: userData.repassword,
            phone: userData.phone || '01000000000', // Add phone input to your form
        });
        
        // Store tokens
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { message: 'success', data };
    } catch (err) {
        console.error('Signup error:', err.response?.data);
        return { 
            error: err.response?.data?.email?.[0] || 
                   err.response?.data?.phone?.[0] || 
                   'Registration failed. Please try again.' 
        };
    }
}

export async function Signin(userData) {
    try {
        const { data } = await api.post('/users/login/', userData);
        
        // Store tokens
        localStorage.setItem('access_token', data.tokens.access);
        localStorage.setItem('refresh_token', data.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { message: 'success', data };
    } catch (err) {
        console.error('Login error:', err.response?.data);
        return { 
            error: err.response?.data?.detail || 'Login failed. Please check your credentials.' 
        };
    }
}

export async function getCurrentUser() {
    try {
        const { data } = await api.get('/users/me/');
        return { success: true, data };
    } catch (err) {
        console.error('Get user error:', err);
        return { success: false, error: err.response?.data };
    }
}

export function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

export default api;