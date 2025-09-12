<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <button @click="$router.back()" class="text-slate-600 hover:text-slate-800 text-sm flex items-center gap-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      <div v-if="loading" class="bg-white p-8 rounded-xl shadow-sm text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-slate-600">Loading booking details...</p>
        </div>
      </div>

      <div v-else-if="error" class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
        <div class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 class="text-lg font-medium text-red-800">Error loading booking</h3>
            <p class="text-red-600 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <img v-if="flight?.airline?.logoUrl" :src="flight.airline.logoUrl" alt="airline" class="w-16 h-16 rounded-lg bg-white p-2 object-contain" />
              <div>
                <div class="text-sm text-blue-100">{{ flight?.airline?.name || flight?.airline?.code || '—' }}</div>
                <div class="text-2xl font-bold">{{ flight?.flightNumber || '-' }}</div>
                <div class="text-sm text-blue-100 mt-1">{{ flight?.segments?.[0]?.aircraft || '' }}</div>
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm text-blue-100">Booking Reference</div>
              <div class="text-3xl font-bold tracking-wide">{{ booking.pnr || '-' }}</div>
              <div class="text-sm mt-2">
                Status: <span :class="statusClass" class="px-2 py-1 rounded-full text-xs font-medium">{{ booking.status || '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Flight Summary -->
        <div class="p-6 bg-slate-50 border-b border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="text-sm text-slate-500">Route</div>
              <div class="text-xl font-bold">{{ originCode }} → {{ destCode }}</div>
              <div class="text-sm text-slate-600">{{ originCity }} → {{ destCity }}</div>
            </div>

            <div class="text-center md:text-right">
              <div class="text-2xl font-bold text-slate-800">{{ depTime }}</div>
              <div class="text-xs text-slate-500">{{ depDate }} • {{ depZone }}</div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm">
            <div>
              <div class="text-slate-500">Arrives</div>
              <div class="font-medium text-slate-800">{{ arrTime }} <span class="text-xs text-slate-500 ml-1">{{ arrDate }} • {{ arrZone }}</span></div>
            </div>

            <div class="text-right">
              <div class="text-slate-500">Duration</div>
              <div class="font-medium text-slate-800">{{ durationStr }}</div>
            </div>
          </div>
        </div>

        <!-- Pricing & Booking Meta -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div class="bg-slate-50 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fare Details
            </h3>
            
            <div class="space-y-3">
              <div>
                <div class="text-xs text-slate-500">Fare class</div>
                <div class="font-medium text-slate-800">{{ booking.fareClass || inferredFareClass || '-' }}</div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Ticket price</div>
                <div class="font-semibold text-blue-600 text-lg">{{ fareDisplay }}</div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Passengers</div>
                <div>{{ booking.passengerCount || booking.passengers?.length || 1 }}</div>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Information
            </h3>
            
            <div class="space-y-3">
              <div>
                <div class="text-xs text-slate-500">Payment method</div>
                <div class="font-medium text-slate-800 capitalize">{{ booking.paymentMethod || '-' }}</div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Payment status</div>
                <div :class="paymentStatusClass" class="px-2 py-1 rounded-full text-xs font-medium inline-block">{{ booking.paymentStatus || '-' }}</div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Booking created</div>
                <div class="text-sm text-slate-600">{{ formatDate(booking.createdAt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Flight Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 pt-0">
          <div class="bg-slate-50 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Flight Details
            </h3>
            
            <div class="space-y-3">
              <div>
                <div class="text-xs text-slate-500">Aircraft</div>
                <div class="font-medium text-slate-800">{{ aircraft || '-' }}</div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Cabin</div>
                <div class="font-medium text-slate-800">{{ cabin || '-' }}</div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Terminal</div>
                <div class="text-sm text-slate-600">From: {{ seg?.terminalOrigin || '-' }} — To: {{ seg?.terminalDestination || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 p-5 rounded-lg">
            <h3 class="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Amenities & Seats
            </h3>
            
            <div class="space-y-3">
              <div>
                <div class="text-xs text-slate-500">Amenities</div>
                <div class="mt-1 flex flex-wrap gap-1">
                  <span v-for="a in flight?.amenities || []" :key="a" class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                    {{ amenLabel(a) }}
                  </span>
                </div>
              </div>

              <div>
                <div class="text-xs text-slate-500">Seats</div>
                <div class="font-medium text-slate-800">{{ booking.seats?.join(', ') || '-' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Passengers -->
        <div class="p-6 border-t border-slate-200">
          <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Passengers
          </h3>
          
          <ul class="space-y-3">
            <li v-for="(p, i) in booking.passengers || []" :key="i" class="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
              <div>
                <div class="font-medium text-slate-800">{{ p.name || '-' }}</div>
                <div class="text-sm text-slate-500">Passport: {{ p.passport ? maskPassport(p.passport) : '-' }}</div>
                <div class="text-xs text-slate-400 mt-1">{{ p.email || '' }}</div>
              </div>
              <div class="text-sm text-slate-600 font-medium">Seat: {{ booking.seats?.[i] || booking.seats?.join(', ') || '-' }}</div>
            </li>
          </ul>
        </div>

        <!-- Ticket -->
        <div class="p-6 border-t border-slate-200 bg-slate-50">
          <h3 class="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Ticket
          </h3>

          <div v-if="ticket" class="p-5 bg-white rounded-lg flex flex-col sm:flex-row sm:items-center gap-5">
            <img v-if="ticket.barcodeUrl" :src="ticket.barcodeUrl" @click="showQr = true" class="w-32 h-32 object-contain bg-white p-2 rounded border border-slate-200 cursor-pointer" />

            <div class="flex-1">
              <div class="text-sm text-slate-500">Issued: {{ formatDate(ticket.issuedAt) }}</div>
              <div class="mt-4 flex gap-2">
                <a v-if="ticket.eTicketPdfUrl" :href="ticket.eTicketPdfUrl" target="_blank" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 bg-white rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p class="text-slate-500">Ticket not yet generated.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- QR modal -->
    <div v-if="showQr" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-white rounded-xl shadow-lg max-w-sm w-full overflow-hidden">
        <div class="flex justify-between items-center p-4 border-b border-slate-200">
          <h3 class="text-lg font-semibold text-slate-800">Ticket QR Code</h3>
          <button @click="showQr = false" class="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 flex flex-col items-center">
          <img v-if="ticket?.barcodeUrl" :src="ticket.barcodeUrl" alt="qr" class="w-64 h-64 object-contain" />
          <div class="text-sm text-slate-500 mt-4">Show this QR code at check-in and boarding</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBooking } from '../services/bookings.service';
import { getFlight } from '../services/flights.service';
import { cancelBooking } from '../services/bookings.service';
import { DateTime } from 'luxon';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const loading = ref(true);
const error = ref(null);
const booking = ref({});
const flight = ref(null);
const ticket = ref(null);
const showQr = ref(false);

// segment convenience
const seg = computed(() => (flight.value?.segments && flight.value.segments[0]) || null);

// Fix for date formatting - handle invalid dates gracefully
function formatDate(iso) {
  if (!iso) return '-';
  try { 
    const dt = DateTime.fromISO(iso);
    return dt.isValid ? dt.toLocaleString(DateTime.DATETIME_MED) : iso;
  } catch { return iso; }
}

function fmtTime(iso, tz) {
  if (!iso) return '-';
  try { 
    const dt = DateTime.fromISO(iso);
    return dt.isValid ? dt.setZone(tz || undefined).toFormat('HH:mm') : iso;
  } catch { return iso; }
}

function fmtDate(iso, tz) {
  if (!iso) return '-';
  try { 
    const dt = DateTime.fromISO(iso);
    return dt.isValid ? dt.setZone(tz || undefined).toFormat('ccc, d LLL') : iso;
  } catch { return iso; }
}

function fmtZone(iso, tz) {
  if (!iso) return '';
  try { 
    const dt = DateTime.fromISO(iso);
    return dt.isValid ? dt.setZone(tz || undefined).offsetNameShort : '';
  } catch { return ''; }
}

const originCity = computed(() => seg.value?.origin?.city || seg.value?.origin?.code || '-');
const destCity = computed(() => seg.value?.destination?.city || seg.value?.destination?.code || '-');
const originCode = computed(() => seg.value?.origin?.code || '-');
const destCode = computed(() => seg.value?.destination?.code || '-');
const depTime = computed(() => fmtTime(seg.value?.departureTime, seg.value?.departureTimezone));
const arrTime = computed(() => fmtTime(seg.value?.arrivalTime, seg.value?.arrivalTimezone));
const depDate = computed(() => fmtDate(seg.value?.departureTime, seg.value?.departureTimezone));
const arrDate = computed(() => fmtDate(seg.value?.arrivalTime, seg.value?.arrivalTimezone));
const depZone = computed(() => fmtZone(seg.value?.departureTime, seg.value?.departureTimezone));
const arrZone = computed(() => fmtZone(seg.value?.arrivalTime, seg.value?.arrivalTimezone));

const durationStr = computed(() => {
  if (!seg.value?.departureTime || !seg.value?.arrivalTime) return '-';
  try {
    const s = DateTime.fromISO(seg.value.departureTime).setZone(seg.value.departureTimezone || undefined);
    const e = DateTime.fromISO(seg.value.arrivalTime).setZone(seg.value.arrivalTimezone || undefined);
    
    if (!s.isValid || !e.isValid) return '-';
    
    const mins = Math.round(e.diff(s).as('minutes'));
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m}m`;
  } catch {
    return '-';
  }
});

const aircraft = computed(() => seg.value?.aircraft || flight.value?.aircraft || '-');
const cabin = computed(() => booking.value?.fareClass || seg.value?.cabin || flight.value?.segments?.[0]?.cabin || '-');

const inferredFareClass = computed(() => {
  // try to infer from flight.fareClasses by price match
  try {
    const fcs = flight.value?.fareClasses || [];
    const found = fcs.find(fc => Number(fc.price) === Number(booking.value?.fare));
    return found?.name || (booking.value?.fareClass || '');
  } catch { return booking.value?.fareClass || ''; }
});

const fareDisplay = computed(() => {
  if (booking.value?.fare) return formatCurrency(booking.value.fare);
  // fallback to flight.fareClasses first item
  const fc = flight.value?.fareClasses?.[0];
  if (fc?.price) return formatCurrency(fc.price);
  return '-';
});

function formatCurrency(v) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(v || 0));
  } catch { return String(v); }
}

function amenLabel(a) {
  if (!a) return a;
  if (a === 'wifi') return 'WiFi';
  if (a === 'inseat_power') return 'In-seat power';
  if (a === 'inflight_entertainment') return 'In-flight entertainment';
  if (a === 'meals') return 'Meals';
  return a.replace(/_/g, ' ');
}

function maskPassport(p) {
  if (!p) return '';
  if (p.length <= 4) return '****';
  return `${String(p).slice(0,2)}****${String(p).slice(-2)}`;
}

const paymentStatusClass = computed(() => {
  const s = String(booking.value?.paymentStatus || '').toLowerCase();
  if (s === 'paid') return 'bg-green-100 text-green-800';
  if (s === 'unpaid') return 'bg-amber-100 text-amber-800';
  if (s === 'refunded') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-800';
});

const statusClass = computed(() => {
  const s = String(booking.value?.status || '').toLowerCase();
  if (s === 'confirmed') return 'bg-green-100 text-green-800';
  if (s === 'pending') return 'bg-amber-100 text-amber-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-800';
});

async function load() {
  loading.value = true;
  error.value = null;
  booking.value = {};
  flight.value = null;
  ticket.value = null;

  try {
    const res = await getBooking(id);
    const data = res?.data ?? res ?? null;

    // API returns { booking, ticket } OR booking directly
    if (data && (data.booking || data.ticket || data.flight)) {
      booking.value = data.booking || (data.booking ?? data) || data || {};
      ticket.value = data.ticket || null;
      flight.value = data.flight || (booking.value && (booking.value.flight || booking.value.flightId)) || null;
    } else {
      booking.value = data || {};
    }

    // If booking.flightId is an object (populated) use it
    if (!flight.value && booking.value?.flightId) {
      if (typeof booking.value.flightId === 'object') {
        flight.value = booking.value.flightId;
      } else if (typeof booking.value.flightId === 'string') {
        try {
          const fRes = await getFlight(booking.value.flightId);
          flight.value = fRes?.data ?? fRes ?? null;
        } catch (fErr) {
          console.warn('Failed to fetch flight by id', fErr);
        }
      }
    }

    // If ticket not in response but booking.ticketGenerated true, you might fetch ticket by booking id (not implemented)
    // If the API returned ticket in a different shape, adapt here.
    if (!ticket.value) {
      // try to see if API provided top-level ticket under data.ticket (handled above) — else do nothing.
    }
  } catch (err) {
    console.error('getBooking failed', err);
    error.value = err?.response?.data?.message || err?.message || 'Failed to load booking';
  } finally {
    loading.value = false;
  }
}

async function onCancel() {
  if (!confirm('Cancel booking?')) return;
  try {
    await cancelBooking(booking.value._id);
    alert('Booking cancelled');
    router.go(0);
  } catch (err) {
    alert(err?.response?.data?.message || err?.message || 'Cancel failed');
  }
}

function viewTicket() {
  if (!ticket.value) return;
  router.push({ name: 'TicketView', params: { id: ticket.value._id } });
}

function openTicketView() {
  // prefer frontend ticket view route using booking id
  router.push({ name: 'TicketView', params: { id: booking.value._id } });
}

onMounted(load);
</script>