<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Track Your Booking</h1>
        <p class="text-gray-500">Find your flight details instantly</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-md mb-6">
        <form @submit.prevent="onLookup" class="flex flex-col gap-3">
          <div class="relative">
            <input
              v-model="pnr"
              placeholder="Enter booking reference (e.g. P3H9TE)"
              class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              autocomplete="off"
              :class="{'pr-10': pnr.length > 0}"
            />
            <svg 
              v-if="pnr.length > 0" 
              @click="pnr = ''" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-gray-400 absolute right-3 top-4 cursor-pointer hover:text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <button 
            :disabled="loading" 
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            :class="{'opacity-75 cursor-not-allowed': loading}"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Searching...' : 'Find Booking' }}
          </button>
        </form>
        <p v-if="hint" class="text-xs text-gray-500 mt-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ hint }}
        </p>
        <p v-if="error" class="text-sm text-red-600 mt-3 p-3 bg-red-50 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </p>
      </div>

      <div v-if="loadingDetails" class="bg-white p-6 rounded-xl shadow-md text-center">
        <div class="flex flex-col items-center justify-center py-4">
          <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading your booking details...</p>
        </div>
      </div>

      <div v-else-if="booking && flight" class="space-y-4">
        <!-- Notification for found ticket -->
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4 animate-fade-in">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-green-700">
                <span class="font-medium">Success!</span> Your ticket has been found.
              </p>
            </div>
          </div>
        </div>

        <TicketCard
          :booking="booking"
          :flight="flight"
          :ticket="ticket"
        />
      </div>

      <div v-else-if="booking && !flight" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              Booking found but flight details are missing. Fetching flight...
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 bg-white rounded-xl shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500">Enter your confirmed booking reference above to view the ticket.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { publicLookupBookingByPnr } from '../services/bookings.service';
import { getFlight } from '../services/flights.service';
import TicketCard from '../components/TicketCard.vue';

const pnr = ref('');
const loading = ref(false);
const loadingDetails = ref(false);
const error = ref(null);
const hint = ref('We will show only confirmed bookings. No login required.');
const booking = ref(null);
const ticket = ref(null);
const flight = ref(null);

async function onLookup() {
  error.value = null;
  booking.value = null;
  ticket.value = null;
  flight.value = null;

  const code = (pnr.value || '').trim();
  if (!code) {
    error.value = 'Enter booking reference';
    return;
  }

  loading.value = true;
  loadingDetails.value = true;

  try {
    const res = await publicLookupBookingByPnr(code);
    // debug: inspect what we got (remove in production)
    // eslint-disable-next-line no-console
    console.debug('publicLookup result:', res);

    booking.value = res.booking || null;
    ticket.value = res.ticket || null;

    // flight may be present in different places depending on backend shape
    flight.value = res.flight || (res.booking && res.booking.flight) || null;

    // If flight still missing but booking.flightId exists (unpopulated), fetch it
    if (!flight.value && booking.value && booking.value.flightId) {
      try {
        const fRes = await getFlight(booking.value.flightId);
        flight.value = fRes.data || fRes;
      } catch (fErr) {
        // eslint-disable-next-line no-console
        console.warn('Failed to fetch flight by id', fErr);
      }
    }

    if (!booking.value) {
      error.value = 'Booking not found or not available for public viewing.';
    }
  } catch (err) {
    // friendly message
    const serverMsg = err?.response?.data?.message;
    if (serverMsg) error.value = serverMsg;
    else error.value = err?.message || 'Lookup failed';
  } finally {
    loading.value = false;
    loadingDetails.value = false;
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>