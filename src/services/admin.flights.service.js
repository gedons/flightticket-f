// src/services/flights.service.js
import api from './api';

/**
 * Public / user endpoints
 */
export const listFlights = (params = {}) => api.get('/flights', { params });
export const getFlight = (id) => api.get(`/flights/${id}`);

/**
 * Admin endpoints (require admin JWT)
 * - createFlight: POST /api/flights
 * - updateFlight: PUT /api/flights/:id
 * - deleteFlight: DELETE /api/flights/:id
 */
export const createFlight = (payload) => api.post('/flights', payload);
export const updateFlight = (id, payload) => api.put(`/flights/${id}`, payload);
export const deleteFlight = (id) => api.delete(`/flights/${id}`);

/**
 * Helpful admin helper: get flights with admin-level details (just uses listFlights)
 * If your backend has a dedicated admin listing endpoint, replace this.
 */
export const adminListFlights = (params = {}) => listFlights(params);

export default {
  listFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  adminListFlights
};
