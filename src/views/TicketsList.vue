<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800">My Tickets</h1>
          <p class="text-sm text-slate-500 mt-1">Access and manage your flight tickets</p>
        </div>
        <button 
          @click="refresh" 
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </header>

      <div v-if="loading" class="bg-white p-8 rounded-xl shadow-sm text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-slate-600">Loading your tickets...</p>
        </div>
      </div>

      <div v-else>
        <div v-if="tickets.length === 0" class="bg-white p-8 rounded-xl shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h3 class="text-lg font-medium text-slate-700 mb-1">No tickets yet</h3>
          <p class="text-slate-500">You haven't generated any tickets from your bookings.</p>
        </div>

        <ul class="space-y-4">
          <li v-for="t in tickets" :key="t._id" class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
            <div class="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex items-center gap-4">
                <div v-if="t.barcodeUrl" class="relative">
                  <img :src="t.barcodeUrl" class="w-20 h-20 object-contain bg-white p-2 rounded-lg border border-slate-200" alt="QR code" />
                  <div class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="text-xs font-medium text-slate-500 uppercase tracking-wide">PNR</div>
                  <div class="text-xl font-bold text-slate-800 mb-1">{{ bookingForTicket(t)?.pnr || '-' }}</div>
                  <div class="text-xs text-slate-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Issued {{ formatIssued(t.issuedAt) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <a 
                  v-if="t.eTicketPdfUrl" 
                  :href="t.eTicketPdfUrl" 
                  target="_blank" 
                  class="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF
                </a>
                <button 
                  @click="openTicket(t)" 
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listMyTickets } from '../services/tickets.service';
import { listUserBookings } from '../services/bookings.service';

const tickets = ref([]);
const bookingsMap = ref({});
const loading = ref(false);
const router = useRouter();

function formatIssued(iso) {
  if (!iso) return '-';
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch { 
    return iso; 
  }
}

async function loadBookingsMap() {
  try {
    const res = await listUserBookings({ limit: 200 });
    const items = res?.data ?? res ?? [];
    items.forEach(b => { bookingsMap.value[b._id] = b; });
  } catch (err) {
    console.warn('loadBookingsMap failed', err);
  }
}

function bookingForTicket(t) {
  if (!t) return null;
  return bookingsMap.value[t.bookingId] || null;
}

async function load() {
  loading.value = true;
  try {
    const res = await listMyTickets();
    const items = res?.data ?? res ?? [];
    tickets.value = Array.isArray(items) ? items : (items.data || items.items || []);
    // also fetch user's bookings so we can show PNR
    await loadBookingsMap();
  } catch (err) {
    console.error('listMyTickets failed', err);
  } finally {
    loading.value = false;
  }
}

function refresh() {
  load();
}

function openTicket(t) {
  // navigate to TicketView by ticket _id
  router.push({ name: 'TicketView', params: { id: t._id } });
}

onMounted(load);
</script>