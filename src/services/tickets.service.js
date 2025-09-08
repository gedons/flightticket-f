// src/services/tickets.service.js
import api from './api';

export const listMyTickets = (params = {}) => api.get('/tickets/me', { params });
export const getMyTicket = (id) => api.get(`/tickets/${id}`); // user endpoint
export const scanTicket = (token) => api.get(`/tickets/scan/${encodeURIComponent(token)}`); // public
