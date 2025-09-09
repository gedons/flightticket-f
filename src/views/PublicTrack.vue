<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">Track your booking</h1>

    <div class="bg-white p-4 rounded shadow mb-6">
      <form @submit.prevent="onLookup" class="flex gap-2 items-center">
        <input
          v-model="pnr"
          placeholder="Enter booking reference (e.g. 1JD13Y)"
          class="flex-1 p-2 border rounded"
          :disabled="loading"
          autocomplete="off"
        />
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-sky-600 text-white rounded"
        >
          {{ loading ? 'Looking...' : 'Find' }}
        </button>
      </form>

      <p v-if="hint" class="text-sm text-slate-500 mt-2">{{ hint }}</p>
      <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
    </div>

    <div v-if="loadingDetails" class="text-sm text-slate-600">Loading booking details...</div>

    <div v-else-if="booking" class="bg-white p-4 rounded shadow">
      <div class="flex justify-between items-start">
        <div>
          <div class="text-lg font-semibold">PNR: {{ booking.pnr }}</div>
          <div class="text-sm text-slate-600">Status: {{ booking.status || '—' }} • Payment: {{ booking.paymentStatus || '—' }}</div>

          <div class="mt-3 text-sm">
            <strong>Flight:</strong>
            {{ flightDisplay }}
          </div>
          <div class="text-sm text-slate-500">
            Departure: {{ formatDate(flightDeparture) }}
          </div>
        </div>

        <div class="text-right">
          <div class="text-sm">Passengers: {{ (booking.passengers || []).length }}</div>
          <div class="mt-2">
            <a
              v-if="ticket?.eTicketPdfUrl"
              :href="ticket.eTicketPdfUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-2 bg-sky-600 text-white rounded"
            >
              Download e-ticket (PDF)
            </a>
          </div>
        </div>
      </div>

      <div class="mt-4 border-t pt-4">
        <h3 class="font-semibold mb-2">Passengers</h3>
        <ul class="space-y-2">
          <li v-for="(p, i) in booking.passengers || []" :key="i" class="text-sm">
            {{ p.name }} <span class="text-slate-500">• {{ p.passport || '-' }}</span>
          </li>
        </ul>
      </div>

      <div v-if="ticket" class="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold">Ticket</h3>
          <p class="text-sm text-slate-600">Issued: {{ formatDate(ticket.issuedAt) }}</p>
          <div class="mt-2">
            <img v-if="ticket.barcodeUrl" :src="ticket.barcodeUrl" alt="QR" class="w-48 h-48" />
            <div v-else class="text-sm text-slate-500">No QR available</div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold">Details</h3>
          <p class="text-sm"><strong>Seats:</strong> {{ (booking.seats || []).join(', ') || '-' }}</p>
          <p class="text-sm"><strong>PNR:</strong> {{ booking.pnr }}</p>
          <p class="text-sm mt-2 text-slate-600">Show either the QR code or the downloadable e-ticket PDF at the airport.</p>
        </div>
      </div>

      <div v-else class="mt-4 text-sm text-slate-600">
        Ticket is not yet issued. Please contact support or wait for confirmation.
      </div>
    </div>

    <div v-else class="text-sm text-slate-600">
      Enter your confirmed booking reference above to view the ticket.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { publicLookupBookingByPnr } from '../services/bookings.service';

const pnr = ref('');
const loading = ref(false);
const loadingDetails = ref(false);
const error = ref(null);
const hint = ref('We will only show confirmed or paid bookings. We do not require login.');

const booking = ref(null);
const ticket = ref(null);

/** Format ISO date safely */
function formatDate(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

/** Derived flight display */
const flightDisplay = computed(() => {
  const f = booking.value?.flight || booking.value?.flightId || {};
  if (!f) return '—';
  const fn = f.flightNumber || f.flightNum || '-';
  const from = f.origin?.code || f.origin || '-';
  const to = f.destination?.code || f.destination || '-';
  return `${fn} • ${from} → ${to}`;
});

const flightDeparture = computed(() => {
  const f = booking.value?.flight || booking.value?.flightId || {};
  return f.departureTime || f.departure || null;
});

async function onLookup() {
  error.value = null;
  booking.value = null;
  ticket.value = null;

  const code = (pnr.value || '').trim();
  if (!code) {
    error.value = 'Enter booking reference';
    return;
  }

  loading.value = true;
  loadingDetails.value = true;

  try {
    const res = await publicLookupBookingByPnr(code);
    booking.value = res.booking || null;
    ticket.value = res.ticket || null;

    if (!booking.value) {
      error.value = 'Booking not found or not available for public viewing.';
    }
  } catch (err) {
    // friendly messages
    const serverMsg = err?.response?.data?.message;
    if (serverMsg) error.value = serverMsg;
    else error.value = err?.message || 'Lookup failed';
  } finally {
    loading.value = false;
    loadingDetails.value = false;
  }
}
</script>

<style scoped>
/* small responsive tweaks if needed */
img { object-fit: contain; }
</style>
