<!-- src/views/PublicTrack.vue -->
<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Track your booking</h2>

    <div class="bg-white p-4 rounded shadow mb-6">
      <form @submit.prevent="onLookup" class="flex gap-2">
        <input v-model="pnr" placeholder="Enter booking reference (e.g. 1JD13Y)" class="flex-1 p-2 border rounded" />
        <button :disabled="loading" class="px-4 py-2 bg-sky-600 text-white rounded">
          {{ loading ? 'Looking...' : 'Find' }}
        </button>
      </form>
      <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
      <p v-if="hint" class="text-sm text-slate-500 mt-2">{{ hint }}</p>
    </div>

    <div v-if="loadingDetails" class="text-sm text-slate-600">Loading booking...</div>

    <div v-else-if="booking" class="bg-white p-4 rounded shadow">
      <div class="flex justify-between items-start">
        <div>
          <div class="text-lg font-semibold">PNR: {{ booking.pnr }}</div>
          <div class="text-sm text-slate-600">Status: {{ booking.status }} • Payment: {{ booking.paymentStatus }}</div>
          <div class="mt-2 text-sm">
            <strong>Flight:</strong> {{ booking.flight?.flightNumber || booking.flightId?.flightNumber || '–' }} •
            {{ booking.flight?.origin?.code || booking.flightId?.origin?.code || '' }} →
            {{ booking.flight?.destination?.code || booking.flightId?.destination?.code || '' }}
          </div>
          <div class="text-sm text-slate-600">
            Departure: {{ formatDate(booking.flight?.departureTime || booking.flightId?.departureTime) }}
          </div>
        </div>

        <div class="text-right">
          <div class="text-sm">Passengers: {{ booking.passengers?.length || 0 }}</div>
          <div class="mt-2">
            <a v-if="ticket?.eTicketPdfUrl" :href="ticket.eTicketPdfUrl" target="_blank" class="px-3 py-2 bg-sky-600 text-white rounded">Download e-ticket (PDF)</a>
          </div>
        </div>
      </div>

      <div class="mt-4 border-t pt-4">
        <h3 class="font-semibold mb-2">Passengers</h3>
        <ul class="space-y-2">
          <li v-for="(p, i) in booking.passengers" :key="i" class="text-sm">
            {{ p.name }} <span class="text-slate-500">• {{ p.passport || '-' }}</span>
          </li>
        </ul>
      </div>

      <div v-if="ticket" class="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold">Ticket</h3>
          <p class="text-sm text-slate-600">Issued: {{ formatDate(ticket.issuedAt) }}</p>
          <img :src="ticket.barcodeUrl" alt="QR" class="w-48 h-48 mt-2" />
        </div>

        <div>
          <h3 class="font-semibold">Details</h3>
          <p class="text-sm"><strong>Seats:</strong> {{ booking.seats?.join(', ') || '-' }}</p>
          <p class="text-sm"><strong>PNR:</strong> {{ booking.pnr }}</p>
          <p class="text-sm mt-2 text-slate-600">You can show the QR or the PDF at the airport.</p>
        </div>
      </div>

      <div v-else class="mt-4 text-sm text-slate-600">
        Ticket is not yet issued. Please contact support or wait for confirmation.
      </div>
    </div>

    <div v-else class="text-sm text-slate-600">Enter your confirmed booking reference above to view the ticket.</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { lookupBookingByPnr } from '../services/bookings.service';
import { useRouter } from 'vue-router';

const pnr = ref('');
const loading = ref(false);
const loadingDetails = ref(false);
const error = ref(null);
const hint = ref('We will only show confirmed bookings.');
const booking = ref(null);
const ticket = ref(null);
const router = useRouter();

function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString();
}

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
  try {
    const res = await lookupBookingByPnr(code);
    // API returns { booking, ticket }
    booking.value = res.data.booking || res.data?.booking;
    ticket.value = res.data.ticket || res.data?.ticket || null;
    loadingDetails.value = false;
  } catch (err) {
    // show friendly messages
    const msg = err?.response?.data?.message || err?.message || 'Lookup failed';
    error.value = msg;
  } finally {
    loading.value = false;
    loadingDetails.value = false;
  }
}
</script>
