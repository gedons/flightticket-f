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

export const createBooking = (payload) => api.post('/bookings', payload);
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const listUserBookings = (params = {}) => api.get('/bookings', { params });
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);
export const markPaid = (id, note = '') => api.post(`/bookings/${id}/mark-paid`, { note });
export const confirmBooking = (id) => api.post(`/bookings/${id}/confirm`);

/* ------------------------
   Public lookup endpoints
   ------------------------ */

/**
 * Normalize a booking lookup response into a predictable shape:
 * { booking, ticket, flight, raw }
 */
function normalizeLookupResponse(res) {
  const raw = res.data;

  // booking candidate
  let booking = null;
  if (raw && (raw.booking || raw.ticket || raw.flight)) {
    booking = raw.booking || null;
  } else if (raw && raw._id) {
    booking = raw;
  } else if (raw && raw.data && Array.isArray(raw.data) && raw.data.length) {
    booking = raw.data[0];
  }

  // ticket candidate
  const ticket = raw && raw.ticket ? raw.ticket : null;

  // flight candidate: try multiple places
  let flight = null;
  if (raw && raw.flight) flight = raw.flight;
  else if (booking && booking.flight) flight = booking.flight;
  else if (booking && booking.flightId && typeof booking.flightId === 'object' && booking.flightId._id) flight = booking.flightId;
  // else leave null; caller may fetch from flight service by id

  return { booking: booking || null, ticket, flight, raw };
}

/**
 * Public lookup by PNR using the authenticated axios instance.
 * Returns { booking, ticket, flight, raw }.
 */
export const lookupBookingByPnr = async (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  const res = await api.get('/bookings/lookup', { params: { pnr: String(pnr).trim() } });
  return normalizeLookupResponse(res);
};

/**
 * Public lookup by PNR WITHOUT auth header.
 * Uses a plain axios instance and API_BASE to guarantee no Authorization header is sent.
 * Returns { booking, ticket, flight, raw }.
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
