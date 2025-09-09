<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">Track Your Booking</h1>
            <p class="text-blue-200 text-sm">Find your e-ticket and flight details</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Search Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200/50 backdrop-blur-sm p-6 mb-8 hover:shadow-2xl transition-all duration-300">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-slate-800">Enter Booking Reference</h2>
        </div>

        <form @submit.prevent="onLookup" class="space-y-4">
          <div class="relative">
            <input
              v-model="pnr"
              placeholder="Enter booking reference (e.g. 1JD13Y)"
              class="w-full p-4 pl-12 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg font-medium tracking-wider uppercase placeholder:normal-case placeholder:tracking-normal disabled:bg-slate-50"
              :disabled="loading"
              autocomplete="off"
              maxlength="8"
            />
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !pnr.trim()"
            class="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Searching...' : 'Find My Booking' }}</span>
          </button>
        </form>

        <!-- Hints and Errors -->
        <div class="mt-4 space-y-2">
          <div v-if="hint && !error" class="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-blue-700">{{ hint }}</p>
          </div>
          
          <div v-if="error" class="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingDetails" class="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8">
        <div class="flex items-center justify-center space-x-3">
          <svg class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-slate-600">Loading booking details...</span>
        </div>
      </div>

      <!-- Booking Results -->
      <div v-else-if="booking" class="space-y-6">
        <!-- Main Booking Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
          <!-- Header -->
          <div class="bg-gradient-to-r from-slate-800 to-slate-700 p-6">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center space-x-3 mb-2">
                  <h2 class="text-2xl font-bold text-white">{{ booking.pnr }}</h2>
                  <span 
                    :class="{
                      'bg-green-500': booking.status === 'confirmed',
                      'bg-amber-500': booking.status === 'pending',
                      'bg-red-500': booking.status === 'cancelled'
                    }"
                    class="px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wide"
                  >
                    {{ booking.status || 'Pending' }}
                  </span>
                </div>
                <p class="text-slate-300 text-sm">
                  Payment: 
                  <span 
                    :class="{
                      'text-green-300': booking.paymentStatus === 'paid',
                      'text-amber-300': booking.paymentStatus === 'pending',
                      'text-red-300': booking.paymentStatus === 'failed'
                    }"
                    class="font-medium"
                  >
                    {{ booking.paymentStatus || 'Pending' }}
                  </span>
                </p>
              </div>
              
              <div class="text-right">
                <div class="text-white text-sm mb-3">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  {{ (booking.passengers || []).length }} Passenger{{ (booking.passengers || []).length !== 1 ? 's' : '' }}
                </div>
                <a
                  v-if="ticket?.eTicketPdfUrl"
                  :href="ticket.eTicketPdfUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>Download E-Ticket</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Flight Information -->
          <div class="p-6">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <div class="flex items-center space-x-2 mb-4">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                <h3 class="font-semibold text-slate-800">Flight Information</h3>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-2xl font-bold text-slate-800 mb-1">{{ flightDisplay }}</p>
                  <p class="text-slate-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ formatDate(flightDeparture) }}
                  </p>
                </div>
                
                <div class="md:text-right">
                  <p class="text-sm text-slate-500 mb-1">Seats Assigned</p>
                  <p class="font-semibold text-slate-800">{{ (booking.seats || []).join(', ') || 'Not assigned' }}</p>
                </div>
              </div>
            </div>

            <!-- Passengers List -->
            <div class="mb-6">
              <h3 class="font-semibold text-slate-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Passengers
              </h3>
              <div class="grid gap-3">
                <div 
                  v-for="(passenger, index) in booking.passengers || []" 
                  :key="index"
                  class="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span class="text-blue-600 font-semibold">{{ passenger.name?.[0]?.toUpperCase() || (index + 1) }}</span>
                    </div>
                    <div>
                      <p class="font-medium text-slate-800">{{ passenger.name || `Passenger ${index + 1}` }}</p>
                      <p class="text-sm text-slate-500">{{ passenger.passport || 'Document not provided' }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-slate-600">Seat</p>
                    <p class="font-semibold text-slate-800">{{ booking.seats?.[index] || 'TBA' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ticket and QR Section -->
            <div v-if="ticket" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- QR Code Card -->
              <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 text-center">
                <h3 class="font-semibold text-slate-800 mb-4 flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  Mobile Boarding Pass
                </h3>
                
                <div v-if="ticket.barcodeUrl" class="mb-4">
                  <img 
                    :src="ticket.barcodeUrl" 
                    alt="QR Code" 
                    class="w-48 h-48 mx-auto border-4 border-white rounded-xl shadow-lg"
                  />
                </div>
                <div v-else class="w-48 h-48 mx-auto bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                  <p class="text-slate-500 text-sm">QR Code Not Available</p>
                </div>
                
                <p class="text-xs text-slate-600">Show this code at security and boarding</p>
              </div>

              <!-- Ticket Details Card -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 class="font-semibold text-slate-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Ticket Details
                </h3>
                
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-slate-600">Issued:</span>
                    <span class="font-medium">{{ formatDate(ticket.issuedAt) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">PNR:</span>
                    <span class="font-mono font-bold text-blue-600">{{ booking.pnr }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-600">Status:</span>
                    <span class="font-medium capitalize">{{ booking.status || 'Pending' }}</span>
                  </div>
                </div>
                
                <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p class="text-xs text-amber-800 leading-relaxed">
                    <strong>Important:</strong> Present either the QR code above or your downloadable e-ticket PDF at the airport for check-in and boarding.
                  </p>
                </div>
              </div>
            </div>

            <!-- No Ticket State -->
            <div v-else class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <svg class="w-12 h-12 text-amber-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="font-semibold text-amber-800 mb-2">Ticket Not Yet Issued</h3>
              <p class="text-amber-700 text-sm">Your e-ticket is being processed. Please check back later or contact support if you have questions.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loadingDetails" class="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-12 text-center">
        <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-slate-600 mb-2">Ready to Track</h3>
        <p class="text-slate-500">Enter your confirmed booking reference above to view your ticket and flight details.</p>
      </div>
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
const hint = ref('We will only show confirmed or paid bookings. No login required.');

const booking = ref(null);
const ticket = ref(null);

/** Format ISO date safely */
function formatDate(iso) {
  if (!iso) return '—';
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
  const fn = f.flightNumber || f.flightNum || '—';
  const from = f.origin?.code || f.origin || '—';
  const to = f.destination?.code || f.destination || '—';
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
    error.value = 'Please enter your booking reference';
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
    else error.value = err?.message || 'Unable to find booking. Please check your reference and try again.';
  } finally {
    loading.value = false;
    loadingDetails.value = false;
  }
}
</script>

<style scoped>
/* Enhanced animations and transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>