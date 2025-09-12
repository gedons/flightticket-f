<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all overflow-hidden">
    <!-- Airline Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-slate-200">
      <div class="flex items-center gap-3">
        <img 
          v-if="flight.airline?.logoUrl" 
          :src="flight.airline.logoUrl" 
          :alt="flight.airline.name" 
          class="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-slate-800 truncate">{{ flight.airline?.name || flight.airline?.code || '—' }}</h3>
          <p class="text-sm text-slate-500">Flight {{ flight.flightNumber }}</p>
        </div>
      </div>
    </div>

    <div class="p-5">
      <!-- Route and Timing -->
      <div class="flex items-center justify-between mb-5">
        <div class="text-center">
          <div class="text-2xl font-bold text-slate-800">{{ fromCode }}</div>
          <div class="text-xs text-slate-500 mt-1">Origin</div>
        </div>
        
        <div class="flex flex-col items-center mx-2 flex-1 max-w-[40%]">
          <div class="w-full flex items-center">
            <div class="h-0.5 bg-blue-200 flex-1"></div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div class="h-0.5 bg-blue-200 flex-1"></div>
          </div>
          <div class="text-xs text-slate-500 mt-1">{{ durationStr }}</div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold text-slate-800">{{ toCode }}</div>
          <div class="text-xs text-slate-500 mt-1">Destination</div>
        </div>
      </div>

      <!-- Departure and Arrival Times -->
      <!-- <div class="grid grid-cols-2 gap-4 mb-5">
        <div class="bg-slate-50 p-3 rounded-lg">
          <div class="text-xs text-slate-500 mb-1">Departure</div>
          <div class="font-medium text-slate-800">{{ depLocal }}</div>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <div class="text-xs text-slate-500 mb-1">Arrival</div>
          <div class="font-medium text-slate-800">{{ arrLocal }}</div>
        </div>
      </div> -->

      <!-- Fare Classes -->
      <div class="mb-5">
        <div class="text-sm font-medium text-slate-700 mb-2">Fare Options</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div 
            v-for="fc in flight.fareClasses || []" 
            :key="fc.name" 
            class="border border-slate-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium text-slate-800 capitalize">{{ fc.name }}</div>
                <div class="text-sm text-slate-500">{{ fc.seatsAvailable }} seats left</div>
              </div>
              <div class="text-lg font-bold text-blue-600">{{ formatCurrency(fc.price) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-4 border-t border-slate-100">
        <!-- <button 
          @click="openDetails" 
          class="flex-1 px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Details
        </button> -->
        <button 
          @click="openBooking" 
          class="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Book Now
        </button>
      </div>
    </div>

    <BookingModal
      :open="showBooking"
      :flight="flight"
      :defaultFare="flight.fareClasses?.[0]?.name"
      @close="showBooking = false"
      @booked="onBooked"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DateTime } from 'luxon';
import BookingModal from './BookingModal.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  flight: { type: Object, required: true }
});
const emits = defineEmits(['booked']);

const router = useRouter();
const showBooking = ref(false);

const seg0 = computed(() => props.flight.segments?.[0] || {});
const fromCode = computed(() => seg0.value.origin?.code || seg0.value.origin || '-');
const toCode = computed(() => seg0.value.destination?.code || seg0.value.destination || '-');

const depLocal = computed(() => {
  try {
    return DateTime.fromISO(seg0.value.departureTime).setZone(seg0.value.departureTimezone || undefined).toLocaleString(DateTime.TIME_SIMPLE);
  } catch { return seg0.value.departureTime || '-'; }
});
const arrLocal = computed(() => {
  try {
    return DateTime.fromISO(seg0.value.arrivalTime).setZone(seg0.value.arrivalTimezone || undefined).toLocaleString(DateTime.TIME_SIMPLE);
  } catch { return seg0.value.arrivalTime || '-'; }
});

const durationStr = computed(() => {
  const mins = seg0.value.travelTimeMinutes || (seg0.value.departureTime && seg0.value.arrivalTime ? (new Date(seg0.value.arrivalTime) - new Date(seg0.value.departureTime)) / 60000 : 0);
  if (!mins) return '-';
  const h = Math.floor(mins/60), m = Math.round(mins%60);
  return `${h}h ${m}m`;
});

function formatCurrency(v) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v || 0);
}

function openDetails() {
  router.push({ name: 'FlightDetails', params: { id: props.flight._id } });
}

function openBooking() {
  showBooking.value = true;
}

function onBooked(res) {
  // emit to parent; parent may refresh bookings list or show success
  emits('booked', res);
  showBooking.value = false;
}
</script>