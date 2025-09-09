// src/services/tickets.service.js
import api from './api';

/**
 * FRONTEND base used for building UI redirect links.
 * Set Vite env var VITE_FRONTEND_BASE (e.g. https://keep-trck.vercel.app) in Vercel.
 * Fallback to window.location.origin when available.
 */
const FRONTEND_BASE = (import.meta.env.VITE_FRONTEND_BASE || '').replace(/\/+$/, '') || (typeof window !== 'undefined' ? window.location.origin : '');

/* ----- API calls ----- */
export const listMyTickets = (params = {}) => api.get('/tickets/me', { params });

export const getMyTicket = (id) => api.get(`/tickets/${id}`);

/**
 * Public scan call.
 * Force JSON by adding ?format=json so backend returns JSON rather than redirecting.
 * This avoids following backend redirects and ensures we get the ticket payload client-side.
 *
 * Usage:
 *  const res = await scanTicket(token);
 *  // res.data -> { ticket, booking }
 */
export const scanTicket = (token) => {
  if (!token) throw new Error('scanTicket: token is required');
  const encoded = encodeURIComponent(token);
  return api.get(`/tickets/scan/${encoded}?format=json`);
};

/* ----- Helpers to open / build frontend URLs ----- */

/**
 * Build a frontend ticket view URL.
 *
 * Prefer providing ticketId if you have it so the path is /tickets/:id/view.
 * If you only provide token, the returned URL will be /tickets/view?token=... — make sure your frontend supports that route.
 *
 * Examples:
 *  getScanFrontendUrl({ token, ticketId }) => https://app/.../tickets/<ticketId>/view?token=...
 */
export function getScanFrontendUrl({ token, ticketId } = {}) {
  if (!FRONTEND_BASE) {
    throw new Error('FRONTEND_BASE not configured. Set VITE_FRONTEND_BASE in your frontend env.');
  }
  if (!ticketId && !token) throw new Error('getScanFrontendUrl: token or ticketId required');

  // prefer ticketId path (recommended)
  if (ticketId) {
    return `${FRONTEND_BASE}/tickets/${encodeURIComponent(ticketId)}/view${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  }

  // fallback: token-only URL (ensure your frontend supports reading token without id)
  return `${FRONTEND_BASE}/tickets/view?token=${encodeURIComponent(token)}`;
}

/**
 * Convenience: open the frontend ticket view in the browser (navigates).
 * Example flow:
 *   const res = await scanTicket(token);
 *   const ticketId = res.data.booking._id;
 *   openScanFrontend({ token, ticketId });
 */
export function openScanFrontend({ token, ticketId } = {}) {
  const url = getScanFrontendUrl({ token, ticketId });
  if (typeof window !== 'undefined') {
    window.location.href = url;
  } else {
    // Node-side fallback
    return url;
  }
}
