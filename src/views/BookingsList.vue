<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800">My Bookings</h1>
          <p class="text-sm text-slate-500 mt-1">Manage your flight reservations</p>
        </div>
        <div class="flex gap-2">
          <button 
            @click="refresh" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <router-link 
            to="/flights/list" 
            class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Flights
          </router-link>
        </div>
      </header>

      <div v-if="loading" class="bg-white p-8 rounded-xl shadow-sm text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-slate-600">Loading your bookings...</p>
        </div>
      </div>

      <div v-else>
        <div v-if="bookings.length === 0" class="bg-white p-8 rounded-xl shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-slate-700 mb-1">No bookings found</h3>
          <p class="text-slate-500">You don't have any flight bookings yet.</p>
          <router-link 
            to="/flights/list" 
            class="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Book Your First Flight
          </router-link>
        </div>

        <ul class="space-y-4">
          <li v-for="b in bookings" :key="b._id" class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
            <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div class="text-xs font-medium text-slate-500 uppercase tracking-wide">PNR</div>
                    <div class="text-xl font-bold text-slate-800">{{ b.pnr }}</div>
                    <div :class="['text-sm font-semibold px-4 py-1 rounded-full', statusClass(b.status)]">
                      {{ b.status || '-' }}
                    </div>
                  </div>                                                                      
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <div class="font-medium">Flight</div>
                      <div>{{ flightLabel(b) }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <div class="font-medium">Passengers</div>
                      <div>{{ (b.passengers || []).map(p => p.name).join(', ') }}</div>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <div>
                      <div class="font-medium">Seats</div>
                      <div>{{ (b.seats || []).join(', ') || 'Not assigned' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2">
                <button 
                  @click="viewBooking(b)" 
                  class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button 
                  v-if="canCancel(b)" 
                  @click="confirmCancel(b)" 
                  class="px-4 py-2 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button 
                  v-if="ticketForBooking(b)" 
                  @click="viewTicket(ticketForBooking(b))" 
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Ticket
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-if="bookings.length > 0" class="mt-8 flex justify-center gap-2">
          <button 
            v-if="page > 1" 
            @click="prevPage" 
            class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <button 
            v-if="bookings.length === limit" 
            @click="nextPage" 
            class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listUserBookings, cancelBooking } from '../services/bookings.service';
import { listMyTickets } from '../services/tickets.service';

const router = useRouter();
const bookings = ref([]);
const tickets = ref([]);
const ticketsMap = ref({});
const loading = ref(false);
const page = ref(1);
const limit = ref(10);

function statusClass(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'confirmed') return 'bg-green-100 text-green-800';
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-800';
}

function flightLabel(bk) {
  const f = bk.flight || bk.flightId || bk.flightId?.flightNumber;
  if (!f) return '-';
  if (typeof f === 'string') return f;
  return `${f.flightNumber || '-'} • ${(f.segments?.[0]?.origin?.code || '-') } → ${(f.segments?.[0]?.destination?.code || '-')}`;
}

function ticketForBooking(bk) {
  return ticketsMap.value[bk._id] || null;
}

async function loadTickets() {
  try {
    const res = await listMyTickets();
    const items = (res?.data ?? res) || [];
    const arr = Array.isArray(items) ? items : (items.data || []);
    tickets.value = arr;
    ticketsMap.value = {};
    tickets.value.forEach(t => { if (t.bookingId) ticketsMap.value[t.bookingId] = t; });
  } catch (err) {
    console.warn('loadTickets error', err);
  }
}

async function load() {
  loading.value = true;
  try {
    const res = await listUserBookings({ page: page.value, limit });
    const data = res?.data ?? res ?? [];
    const arr = Array.isArray(data) ? data : (data.data || data.items || []);
    bookings.value = arr;
    await loadTickets();
  } catch (err) {
    console.error('listUserBookings failed', err);
  } finally {
    loading.value = false;
  }
}

function viewBooking(b) {
  router.push({ name: 'BookingDetails', params: { id: b._id } });
}

function viewTicket(t) {
  // route to ticket view by ticket id to keep auth path
  router.push({ name: 'TicketView', params: { id: t._id } });
}

function canCancel(b) {
  return String(b.status || '').toLowerCase() === 'pending';
}

async function confirmCancel(b) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  try {
    await cancelBooking(b._id);
    alert('Booking cancelled successfully');
    load();
  } catch (err) {
    alert(err?.response?.data?.message || err?.message || 'Cancel failed');
  }
}

function prevPage() {
  if (page.value > 1) { page.value -= 1; load(); }
}
function nextPage() {
  page.value += 1;
  load();
}

function refresh() {
  page.value = 1;
  load();
}

onMounted(load);
</script>