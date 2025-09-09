// src/services/bookings.service.js
import api from './api';
import axios from 'axios';

/**
 * Base API host for no-auth calls.
 * Set VITE_API_BASE in Vercel (e.g. https://flightticket-qb1w.onrender.com)
 */
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '') || 'https://flightticket-qb1w.onrender.com';

/* ------------------------
   Authenticated endpoints
   ------------------------ */

/** Create a booking (authenticated)
 * payload: { flightId, fareClass, passengerCount, passengers[], seats[], paymentMethod? }
 */
export const createBooking = (payload) => api.post('/bookings', payload);

/** Get a booking (authenticated) */
export const getBooking = (id) => api.get(`/bookings/${id}`);

/** List bookings for current user (authenticated) */
export const listUserBookings = (params = {}) => api.get('/bookings', { params });

/** Cancel a booking (authenticated) */
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);

/** Admin: mark booking as paid */
export const markPaid = (id, note = '') => api.post(`/bookings/${id}/mark-paid`, { note });

/** Admin: confirm booking (generate ticket) */
export const confirmBooking = (id) => api.post(`/bookings/${id}/confirm`);

/* ------------------------
   Public lookup endpoints
   ------------------------ */

/**
 * Normalize a booking lookup response from backend into { booking, ticket, raw }.
 * Backend shapes might vary; this helper makes the frontend code predictable.
 */
function normalizeLookupResponse(res) {
  const raw = res.data;
  // Preferred: backend returns { booking, ticket }
  if (raw && (raw.booking || raw.ticket)) {
    return { booking: raw.booking || null, ticket: raw.ticket || null, raw };
  }
  // If backend returned booking directly
  if (raw && raw._id) {
    return { booking: raw, ticket: null, raw };
  }
  // If backend wrapped response: { data: [...] }
  if (raw && raw.data && Array.isArray(raw.data)) {
    return { booking: raw.data[0] || null, ticket: null, raw };
  }
  // fallback
  return { booking: null, ticket: null, raw };
}

/**
 * Public lookup by PNR using the authenticated axios instance.
 * Returns { booking, ticket, raw }.
 */
export const lookupBookingByPnr = async (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  const res = await api.get('/bookings/lookup', { params: { pnr: String(pnr).trim() } });
  return normalizeLookupResponse(res);
};

/**
 * Public lookup by PNR WITHOUT auth header.
 * Uses a plain axios instance and API_BASE to guarantee no Authorization header is sent.
 * Returns { booking, ticket, raw }.
 */
export const publicLookupBookingByPnr = async (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  const url = `${API_BASE}/api/bookings/lookup`;
  const res = await axios.get(url, { params: { pnr: String(pnr).trim() } });
  return normalizeLookupResponse(res);
};

/** Raw lookup (returns axios response) */
export const lookupBookingRaw = (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  return api.get('/bookings/lookup', { params: { pnr: String(pnr).trim() } });
};

export default {
  createBooking,
  getBooking,
  listUserBookings,
  cancelBooking,
  markPaid,
  confirmBooking,
  lookupBookingByPnr,
  publicLookupBookingByPnr,
  lookupBookingRaw
};
