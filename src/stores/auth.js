// src/stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as authService from '../services/auth.service';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(null); // entire user object from /auth/me
  const role = ref(localStorage.getItem('role') || null);
  const loading = ref(false);
  const error = ref(null);

  const setToken = (t) => {
    token.value = t;
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  };
  const setRole = (r) => {
    role.value = r;
    if (r) localStorage.setItem('role', r);
    else localStorage.removeItem('role');
  };
  const setUser = (u) => { user.value = u; };

  async function register(payload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.register(payload);
      loading.value = false;
      return res.data;
    } catch (err) {
      loading.value = false;
      error.value = err?.response?.data?.message || err.message;
      throw err;
    }
  }

  async function login(payload) {
    loading.value = true;
    error.value = null;
    try {
      const res = await authService.login(payload);
      // earlier backend returns { token, role }
      const { token: tok, role: r } = res.data;
      if (!tok) throw new Error('No token in response');
      setToken(tok);
      setRole(r || null);

      // fetch profile
      const meRes = await authService.me();
      setUser(meRes.data);

      loading.value = false;
      return { role: r, user: meRes.data };
    } catch (err) {
      loading.value = false;
      setToken(null);
      setRole(null);
      setUser(null);
      error.value = err?.response?.data?.message || err.message;
      throw err;
    }
  }

  function logout() {
    setToken(null);
    setRole(null);
    setUser(null);
  }

  const isAuthenticated = () => !!token.value;
  return {
    token, user, role, loading, error,
    register, login, logout, isAuthenticated, setUser
  };
});
