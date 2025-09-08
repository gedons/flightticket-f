// src/services/api.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://flightticket-qb1w.onrender.com';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
});

// Request interceptor: attach token from localStorage (keeps store-free)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
