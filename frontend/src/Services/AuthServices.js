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
        console.log('Sending registration data:', userData);
        
        // Match backend expected format from README
        const { data } = await api.post('/auth/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            phone: userData.phone
        });
        
        console.log('Signup response:', data);
        
        if (data.success) {
                // Normalize token/user locations and store them
                const token = data?.data?.token || data?.token || data?.authToken;
                const user = data?.data?.user || data?.user;

                if (token) localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));

                // Return a clear shape so callers can read token directly
                return { message: 'success', token, user, raw: data };
        } else {
            return { error: data.message || 'Registration failed' };
        }
    } catch (err) {
        console.error('Signup error:', err.response?.data || err);
        
        // Extract error message from various possible formats
        let errorMessage = 'Registration failed. Please try again.';
        
        if (err.response?.data) {
            if (err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                errorMessage = err.response.data.errors.map(e => e.msg).join(', ');
            } else if (typeof err.response.data === 'string') {
                errorMessage = err.response.data;
            }
        }
        
        return { error: errorMessage };
    }
}

export async function Signin(userData) {
    try {
        console.log('Sending login data:', userData);
        
        const { data } = await api.post('/auth/login', {
            email: userData.email,
            password: userData.password
        });
        
        console.log('Login response:', data);
        
        if (data.success) {
                const token = data?.data?.token || data?.token || data?.authToken;
                const user = data?.data?.user || data?.user;

                if (token) localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));

                return { message: 'success', token, user };
        } else {
            return { error: data.message || 'Login failed' };
        }
    } catch (err) {
        console.error('Login error:', err.response?.data || err);
        
        // Extract error message
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (err.response?.data) {
            if (err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
                errorMessage = err.response.data.errors.map(e => e.msg).join(', ');
            }
        }
        
        return { error: errorMessage };
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