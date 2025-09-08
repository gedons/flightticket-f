// src/services/admin.airports.service.js
import api from './api';

/**
 * Helper: unwraps API responses that use { data: [...], pagination: {...} }
 * Returns an object: { items, pagination, raw } where items is the array you want.
 */
function unwrapListResponse(res) {
  const raw = res.data;
  if (raw && Array.isArray(raw.data)) {
    return { items: raw.data, pagination: raw.pagination || null, raw };
  }
  // fallback: if API returned an array directly
  if (Array.isArray(res.data)) {
    return { items: res.data, pagination: null, raw: res.data };
  }
  // otherwise try to find items field
  return { items: res.data?.items || [], pagination: res.data?.pagination || null, raw: res.data };
}

export const listAirports = async (params = {}) => {
  const res = await api.get('/airports', { params });
  return unwrapListResponse(res); // caller gets { items, pagination, raw }
};

export const getAirport = (id) => api.get(`/airports/${id}`);

export const createAirport = (payload) => api.post('/airports', payload);

export const updateAirport = (id, payload) => api.put(`/airports/${id}`, payload);

export const deleteAirport = (id) => api.delete(`/airports/${id}`);
