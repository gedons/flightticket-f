// src/services/admin.tickets.service.js
import api from './api';

export const listTicketsAdmin = (params = {}) => api.get('/tickets', { params });
export const getTicketAdmin = (id) => api.get(`/tickets/admin/${id}`);
export const deleteTicketAdmin = (id) => api.delete(`/tickets/admin/${id}`);
export const regeneratePdf = (id) => api.post(`/tickets/admin/${id}/regenerate-pdf`);
