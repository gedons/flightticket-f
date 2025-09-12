<template>
  <div class="max-w-7xl mx-auto p-4">
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Your dashboard</h1>
        <p class="text-sm text-slate-500 mt-1">Overview of your trips, tickets and bookings.</p>
      </div>

      <div class="flex gap-3 items-center">
        <button @click="refresh" class="px-4 py-2 bg-sky-600 text-white rounded shadow-sm">Refresh</button>
        <router-link to="/flights/list" class="px-4 py-2 border rounded text-sm">Search flights</router-link>
      </div>
    </header>

    <!-- summary tiles -->
    <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Upcoming trips</div>
          <div class="text-2xl font-semibold">{{ summaries.upcoming }}</div>
        </div>
        <div class="text-slate-400 text-3xl">✈️</div>
      </div>

      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Tickets</div>
          <div class="text-2xl font-semibold">{{ summaries.tickets }}</div>
        </div>
        <div class="text-slate-400 text-3xl">🎫</div>
      </div>

      <div class="bg-white p-4 rounded shadow flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Pending payments</div>
          <div class="text-2xl font-semibold">{{ summaries.pending }}</div>
        </div>
        <div class="text-slate-400 text-3xl">💳</div>
      </div>
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bookings list -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">My bookings</h2>
          <div class="text-sm text-slate-500">Showing upcoming and recent bookings</div>
        </div>

        <div v-if="loadingBookings" class="text-sm text-slate-600">Loading bookings...</div>
        <div v-else>
          <div v-if="bookings.length === 0" class="bg-white p-6 rounded shadow text-slate-600">
            No bookings found. Search flights to book your next trip.
          </div>

          <ul v-else class="space-y-4">
            <li v-for="b in bookings" :key="b._id">
              <UserBookingCard
                :booking="b"
                :ticket="ticketsByBooking[b._id] || null"
                @cancel="onCancelBooking"
                @view="onViewBooking"
                @viewTicket="onViewTicket"
              />
            </li>
          </ul>
        </div>
      </div>

      <!-- Tickets list -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold">My tickets</h2>
          <div class="text-sm text-slate-500">Download or show your e-ticket QR</div>
        </div>

        <div v-if="loadingTickets" class="text-sm text-slate-600">Loading tickets...</div>

        <div v-else>
          <div v-if="tickets.length === 0" class="bg-white p-6 rounded shadow text-slate-600">
            No tickets found yet.
          </div>

          <ul v-else class="space-y-4">
            <li v-for="t in tickets" :key="t._id">
              <UserTicketCard
                :ticket="t"
                :booking="bookingsById[t.bookingId] || null"
                @view="onViewTicketByTicket"
                @download="onDownloadPdf"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { DateTime } from 'luxon';
import { useRouter } from 'vue-router';
import UserBookingCard from '../components/UserBookingCard.vue';
import UserTicketCard from '../components/UserTicketCard.vue';
import { listUserBookings, cancelBooking } from '../services/bookings.service';
import { listMyTickets } from '../services/tickets.service';
import { useAuthStore } from '../stores/auth';

// state
const router = useRouter();
const auth = useAuthStore();

const bookings = ref([]);
const bookingsById = reactive({});
const tickets = ref([]);
const ticketsByBooking = reactive({});

const loadingBookings = ref(false);
const loadingTickets = ref(false);

const summaries = reactive({ upcoming: 0, tickets: 0, pending: 0 });

/** Normalize axios response to array */
function extractArray(res) {
  if (!res) return [];
  const d = res.data ?? res;
  if (Array.isArray(d)) return d;
  if (d && Array.isArray(d.data)) return d.data;
  // some endpoints return { items: [...] }
  if (d && Array.isArray(d.items)) return d.items;
  return [];
}

async function loadBookings() {
  loadingBookings.value = true;
  try {
    const res = await listUserBookings({ limit: 50 });
    const items = extractArray(res);
    // simple sorting: upcoming first (by departure in flight if present)
    const sorted = items.sort((a, b) => {
      const aTime = (a.flight?.segments?.[0]?.departureTime || a.flightId?.departureTime || a.createdAt) || null;
      const bTime = (b.flight?.segments?.[0]?.departureTime || b.flightId?.departureTime || b.createdAt) || null;
      return new Date(aTime || 0) - new Date(bTime || 0);
    });
    bookings.value = sorted;
    // build map
    bookings.value.forEach(b => { bookingsById[b._id] = b; });
    // update summary
    summaries.upcoming = bookings.value.filter(b => String(b.status || '').toLowerCase() === 'confirmed').length;
    summaries.pending = bookings.value.filter(b => (b.paymentStatus || 'unpaid') === 'unpaid').length;
  } catch (err) {
    console.error('loadBookings', err);
  } finally {
    loadingBookings.value = false;
  }
}

async function loadTickets() {
  loadingTickets.value = true;
  try {
    const res = await listMyTickets();
    const items = extractArray(res);
    tickets.value = items;
    summaries.tickets = tickets.value.length;
    tickets.value.forEach(t => {
      if (t.bookingId) ticketsByBooking[t.bookingId] = t;
    });
  } catch (err) {
    console.error('loadTickets', err);
  } finally {
    loadingTickets.value = false;
  }
}

async function refresh() {
  await Promise.all([loadBookings(), loadTickets()]);
}

function onViewBooking(booking) {
  // navigate to booking detail page
  router.push({ name: 'BookingDetails', params: { id: booking._id } });
}

function onViewTicket({ ticket, booking }) {
  // route to ticket view
  router.push({ path: `/tickets/${booking ? booking._id : ticket.bookingId}/view`, query: { token: '' } });
}

function onViewTicketByTicket(ticket) {
  router.push({ path: `/tickets/${ticket.bookingId}/view` });
}

async function onCancelBooking(booking) {
  if (!confirm('Cancel booking?')) return;
  try {
    await cancelBooking(booking._id);
    // refresh
    await refresh();
    alert('Booking cancelled');
  } catch (err) {
    console.error('cancelBooking', err);
    alert(err?.response?.data?.message || err?.message || 'Cancel failed');
  }
}

function onDownloadPdf(ticket) {
  if (ticket.eTicketPdfUrl) window.open(ticket.eTicketPdfUrl, '_blank');
}

onMounted(async () => {
  // if not authenticated redirect to login
  if (!auth.isAuthenticated || !auth.isAuthenticated()) {
    router.push('/login');
    return;
  }
  await refresh();
});
</script>
