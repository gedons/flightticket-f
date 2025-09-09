// src/services/bookings.service.js
import api from './api';
import axios from 'axios';

/**
 * Base API host (used for the public/no-auth calls).
 * Make sure VITE_API_BASE is set in your environment (Vercel).
 */
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '') || 'https://flightticket-qb1w.onrender.com';

/* ------------------------
   Authenticated endpoints
   ------------------------ */

/**
 * Create a booking (authenticated)
 * payload: { flightId, fareClass, passengerCount, passengers[], seats[], paymentMethod? }
 */
export const createBooking = (payload) => api.post('/bookings', payload);

/** Get a booking by id (authenticated) */
export const getBooking = (id) => api.get(`/bookings/${id}`);

/** List bookings for the logged-in user (authenticated).
 * Returns axios response (res.data could be array or wrapped object depending on backend).
 */
export const listUserBookings = (params = {}) => api.get('/bookings', { params });

/** Cancel a booking (authenticated) */
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`);

/** Admin: mark booking paid */
export const markPaid = (id, note = '') => api.post(`/bookings/${id}/mark-paid`, { note });

/** Admin: confirm booking (generate ticket) */
export const confirmBooking = (id) => api.post(`/bookings/${id}/confirm`);

/* ------------------------
   Public / Lookup endpoints
   ------------------------ */

/**
 * Normalizes the lookup response so callers get { booking, ticket, raw }.
 * Backend may return { booking, ticket } or booking directly — this helper accounts for both.
 */
function normalizeLookupResponse(res) {
  const raw = res.data;
  // If backend returned { booking, ticket }
  if (raw && (raw.booking || raw.ticket)) {
    return { booking: raw.booking || null, ticket: raw.ticket || null, raw };
  }
  // If backend returned booking directly
  if (raw && raw._id) {
    return { booking: raw, ticket: null, raw };
  }
  // If backend wrapped list (unlikely for lookup), attempt common shapes
  if (raw && raw.data && Array.isArray(raw.data)) {
    return { booking: raw.data[0] || null, ticket: null, raw };
  }
  return { booking: null, ticket: null, raw };
}

/**
 * Public lookup by PNR (uses the authenticated axios instance).
 * Suitable when you don't care about Authorization header (api instance may attach it).
 * Returns normalized object: { booking, ticket, raw }.
 */
export const lookupBookingByPnr = async (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  const url = `${API_BASE}/api/bookings/lookup`;
  const res = await axios.get(url, { params: { pnr: String(pnr).trim() } });
  return normalizeLookupResponse(res);
};

/**
 * Public lookup by PNR WITHOUT auth header.
 * This uses a plain axios instance pointed at API_BASE so the request is guaranteed to be unauthenticated.
 * Returns normalized object: { booking, ticket, raw }.
 */
export const publicLookupBookingByPnr = async (pnr) => {
  if (!pnr) throw new Error('pnr is required');
  const url = `${API_BASE}/api/bookings/lookup`;
  const res = await axios.get(url, { params: { pnr: String(pnr).trim() } });
  return normalizeLookupResponse(res);
};

/* ------------------------
   Convenience helpers
   ------------------------ */

/**
 * If callers want the raw axios response for advanced handling, return it.
 * Example usage: const res = await lookupBookingRaw('1JD13Y');
 */
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
