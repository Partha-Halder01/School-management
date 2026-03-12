import axios from 'axios';

const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = configuredBase ? configuredBase.replace(/\/+$/, '') : '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers?.Authorization) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (baseURL.includes('ngrok-free.dev')) {
        config.headers = config.headers || {};
        config.headers['ngrok-skip-browser-warning'] = '69420';
    }

    return config;
});

export default api;
