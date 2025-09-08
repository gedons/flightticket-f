// src/services/admin.flights.service.js
import api from './api';

// create flight (admin)
export const createFlight = (payload) => api.post('/flights', payload);

// update flight
export const updateFlight = (id, payload) => api.put(`/flights/${id}`, payload);

// delete flight
export const deleteFlight = (id) => api.delete(`/flights/${id}`);

// list flights (admin or public can use /flights with query)
export const listFlights = (params = {}) => api.get('/flights', { params });

// get one flight
export const getFlight = (id) => api.get(`/flights/${id}`);
