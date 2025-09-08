// src/services/flights.service.js
import api from './api';

export const searchFlights = (params) => {
  // params: { origin, destination, date, passengers }
  return api.get('/flights', { params });
};

export const getFlight = (id) => api.get(`/flights/${id}`);
