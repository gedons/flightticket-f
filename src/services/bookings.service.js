// src/services/bookings.service.js
import api from './api';

export const createBooking = (payload) => {
  // payload: flightId, fareClass, passengerCount, passengers[], seats[], paymentMethod (optional)
  return api.post('/bookings', payload);                                  
};

export const getBooking = (id) => api.get(`/bookings/${id}`);
export const listUserBookings = (params = {}) => api.get('/bookings', { params }); // page, limit
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);
export const markPaid = (id, note = '') => api.post(`/bookings/${id}/mark-paid`, { note }); // admin only
export const confirmBooking = (id) => api.post(`/bookings/${id}/confirm`); // admin only
           
export const lookupBookingByPnr = (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  return api.get('/bookings/lookup', { params: { pnr: String(pnr).trim() } });
};
