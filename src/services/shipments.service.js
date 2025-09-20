// src/services/shipments.service.js
import api from './api';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '') || '';

export const createShipment = (payload) => api.post('/shipments', payload);
export const listShipments = (params = {}) => api.get('/shipments', { params });
export const getShipmentAdmin = (id) => api.get(`/shipments/${id}`);
export const updateShipment = (id, payload) => api.put(`/shipments/${id}`, payload);
export const deleteShipment = (id) => api.delete(`/shipments/${id}`);
export const addShipmentLocation = (id, payload) => api.post(`/shipments/${id}/locations`, payload);

// upload image (multipart/form-data) - calls admin uploads route (protected)
export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('file', file);
  // using shipments/uploads (as implemented above)
  return api.post('/shipments/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
};
// SSE subscribe (returns EventSource)
export const subscribeToShipmentStream = (trackingCode) => {
  if (!trackingCode) throw new Error('trackingCode required for stream');
  const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '') || '';
  const url = `${API_BASE}/api/shipments/stream/${encodeURIComponent(trackingCode)}`;
  const es = new EventSource(url);
  return es; // consumer must es.close() when done
};


// public lookup by tracking code (no auth)
export const publicLookupShipmentByCode = (code) => axios.get(`${API_BASE}/api/shipments/public/lookup`, { params: { code } });
// public scan
export const publicScanByCode = (code) => axios.get(`${API_BASE}/api/shipments/public/scan/${encodeURIComponent(code)}`);

// print URL (frontend opens this)
export const getPrintUrl = (id) => `${API_BASE}/api/shipments/${encodeURIComponent(id)}/print`;

export default {
  createShipment, listShipments, getShipmentAdmin, updateShipment, deleteShipment, addShipmentLocation, uploadImage, publicLookupShipmentByCode, publicScanByCode, getPrintUrl
};
