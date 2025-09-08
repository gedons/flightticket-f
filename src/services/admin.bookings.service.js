// src/services/admin.bookings.service.js
import api from './api';

// list bookings (admin) -> calls /api/admin/bookings
export const listBookings = (params = {}) => api.get('/admin/bookings', { params });

// get single booking (admin)
export const getBookingAdmin = (id) => api.get(`/admin/bookings/${id}`);

// mark as paid
export const markBookingPaid = (id, note = '') => api.post(`/bookings/${id}/mark-paid`, { note });

// confirm booking (generate ticket)
export const confirmBooking = (id) => api.post(`/bookings/${id}/confirm`);

// cancel booking
export const cancelBookingAdmin = (id) => api.post(`/bookings/${id}/cancel`);
