// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import UserDashboard from '../views/UserDashboard.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },

  // protected user routes
  { path: '/dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true, role: 'user' } },
  { path: '/flights', name: 'FlightSearch', component: () => import('../views/FlightSearch.vue') },
  { path: '/flights/:id', name: 'FlightDetails', component: () => import('../views/FlightDetails.vue') },
  { path: '/booking', name: 'BookingFlow', component: () => import('../views/BookingFlow.vue'), meta: { requiresAuth: true,  role: 'user' } },

  { path: '/bookings', name: 'BookingsList', component: () => import('../views/BookingsList.vue'), meta: { requiresAuth: true,  role: 'user' } },
  { path: '/bookings/:id', name: 'BookingDetails', component: () => import('../views/BookingDetails.vue'), meta: { requiresAuth: true,  role: 'user' } },

  { path: '/tickets', name: 'TicketsList', component: () => import('../views/TicketsList.vue'), meta: { requiresAuth: true,  role: 'user' } },
  { path: '/tickets/:id/view', name: 'TicketView', component: () => import('../views/TicketView.vue'), meta: { requiresAuth: true,  role: 'user' } },
  { path: '/track', name: 'PublicTrack', component: () => import('../views/PublicTrack.vue') },

  //protected admin routes
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/flights', name: 'AdminFlights', component: () => import('../views/admin/AdminFlights.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/bookings', name: 'AdminBookings', component: () => import('../views/admin/AdminBookings.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/tickets', name: 'AdminTickets', component: () => import('../views/admin/AdminTickets.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/airports', name: 'AdminAirports', component: () => import('../views/admin/AdminAirports.vue'), meta: { requiresAuth: true, role: 'admin' } },

  // catch all -> home
  { path: '/:catchAll(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// global guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const requiresAuth = to.meta?.requiresAuth;

  // if store has token but user null, try to fetch profile
  if (auth.token && !auth.user) {
    try {
      const res = await authServiceFetchMe(); // helper below
      auth.setUser(res);
    } catch (err) {
      // ignore, user will be treated as not authenticated
      auth.logout();
    }
  }

  if (requiresAuth) {
    if (!auth.isAuthenticated()) {
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    }
    const roleReq = to.meta.role;
    if (roleReq && auth.role !== roleReq) {
      // role mismatch -> redirect to their dashboard
      if (auth.role === 'admin') return next({ name: 'AdminDashboard' });
      return next({ name: 'UserDashboard' });
    }
  }
  return next();
});

/**
 * Utility: fetch /auth/me via the api instance (no circular import)
 */
async function authServiceFetchMe() {
  // note: import inside function to avoid circular deps
  const api = (await import('../services/api.js')).default;
  const res = await api.get('/auth/me');
  return res.data;
}

export default router;
