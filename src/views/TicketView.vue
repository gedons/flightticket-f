<template>
  <div class="min-h-screen bg-slate-50 p-4">
    <div class="max-w-md mx-auto">
      <div class="mb-3">
        <button @click="goBack" class="text-slate-600 text-sm">← Back</button>
      </div>

      <div v-if="loading" class="text-sm text-slate-600 text-center py-8">Loading ticket...</div>

      <div v-else-if="error" class="bg-white p-4 rounded shadow text-sm text-red-600">
        {{ error }}
      </div>

      <div v-else-if="booking && flight" class="space-y-4">
        <TicketCard :booking="booking" :flight="flight" :ticket="ticket" />
      </div>

      <div v-else class="bg-white p-4 rounded shadow text-sm text-slate-600">
        Ticket not found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TicketCard from '../components/TicketCard.vue';
import { scanTicket, getMyTicket, listMyTickets } from '../services/tickets.service';
import { lookupBookingByPnr } from '../services/bookings.service';
import { getFlight } from '../services/flights.service';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref(null);
const booking = ref(null);
const ticket = ref(null);
const flight = ref(null);

function goBack() {
  router.back();
}

/**
 * Helper: safe assign flight if present inside ticket/booking payloads
 */
function setFromResponse(res) {
  // res might be axios response or normalized object; account for both
  const data = res?.data ?? res ?? null;
  if (!data) return;
  // try many shapes
  ticket.value = data.ticket || data || data.ticket || data;
  booking.value = data.booking || (data.booking ?? data.booking) || data.booking || data.bookingId ? (data.booking || null) : booking.value;
  // flight:
  flight.value = data.flight || booking.value?.flight || ticket.value?.flight || null;
}

onMounted(async () => {
  loading.value = true;
  error.value = null;

  const token = route.query?.token || null;
  const paramId = route.params?.id || null; // this might be ticketId or bookingId depending on how you route

  console.debug('[TicketView] route params:', { token, paramId });

  try {
    if (token) {
      // Public scan flow
      console.debug('[TicketView] using token scanTicket');
      const res = await scanTicket(token);
      // scanTicket returns axios response -> res.data has { ticket, booking, flight }
      console.debug('[TicketView] scanTicket result:', res?.data ?? res);
      const data = res?.data ?? res;
      ticket.value = data.ticket || null;
      booking.value = data.booking || null;
      flight.value = data.flight || booking.value?.flight || null;

      // if flight is still missing and booking has flightId, try fetching flight
      if (!flight.value && booking.value?.flightId) {
        try {
          const fRes = await getFlight(booking.value.flightId);
          flight.value = fRes?.data ?? fRes;
        } catch (err) {
          console.warn('[TicketView] failed to fetch flight by id', err);
        }
      }
      loading.value = false;
      return;
    }

    if (paramId) {
      // Try to get ticket by ticketId (authenticated)
      console.debug('[TicketView] trying getMyTicket with id:', paramId);
      try {
        const res = await getMyTicket(paramId);
        console.debug('[TicketView] getMyTicket result:', res?.data ?? res);
        const data = res?.data ?? res;
        // backend might return { ticket, booking, flight } or ticket object with booking embedded
        ticket.value = data.ticket ?? data;
        booking.value = data.booking ?? data.booking ?? ticket.value?.booking ?? null;
        flight.value = data.flight ?? booking.value?.flight ?? ticket.value?.flight ?? null;

        // If still missing flight but booking.flightId present, fetch it
        if (!flight.value && booking.value?.flightId) {
          try {
            const fRes = await getFlight(booking.value.flightId);
            flight.value = fRes?.data ?? fRes;
          } catch (err) {
            console.warn('[TicketView] failed to fetch flight by id (post-getMyTicket)', err);
          }
        }

        // If we got something, finish
        if (ticket.value || booking.value) {
          loading.value = false;
          return;
        }
      } catch (err) {
        console.debug('[TicketView] getMyTicket failed:', err?.response?.data ?? err.message ?? err);
        // continue to fallback
      }

      // Fallback: if route has a pnr query, try public lookup
      const pnr = route.query?.pnr || null;
      if (pnr) {
        console.debug('[TicketView] fallback lookup by pnr:', pnr);
        try {
          const lookup = await lookupBookingByPnr(pnr);
          console.debug('[TicketView] lookupBookingByPnr result:', lookup);
          booking.value = lookup.booking || null;
          ticket.value = lookup.ticket || null;
          flight.value = lookup.flight || booking.value?.flight || null;
          loading.value = false;
          return;
        } catch (err) {
          console.warn('[TicketView] fallback lookup failed', err);
        }
      }
    }

    // nothing found
    error.value = 'Ticket not found.';
  } catch (err) {
    console.error('[TicketView] unexpected error', err);
    error.value = err?.response?.data?.message || err?.message || 'Failed to load ticket';
  } finally {
    loading.value = false;
  }
});
</script>
