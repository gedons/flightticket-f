<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden max-w-md mx-auto">
    <!-- Header with close button and title -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-lg font-medium text-gray-900">Flight details</h2>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Flight number indicator -->
      <div class="text-xs text-gray-500 mb-4 font-semibold">Flight 1 of 7</div>

      <!-- Main flight card -->
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <!-- Airline header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-6 h-6">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.5 19h19v2h-19zm1.1-4.5L12 9l8.4 5.5H2.6z"/>
            </svg>
          </div>
          <span class="font-semibold text-gray-900"><span class="text-sm">{{ flight.airline?.name || 'TestAir' }}</span> <span class="text-xs text-gray-500">{{ flight.flightNumber || 'TA100' }}</span></span>
        </div>

        <!-- Flight route with timeline -->
        <div class="relative">
          <!-- Vertical line -->
          <div class="absolute left-2 top-8 bottom-8 w-0.5 bg-blue-600"></div>
          
          <!-- Departure -->
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-start gap-4">
              <div class="w-4 h-4 bg-blue-600 rounded-full mt-1 relative z-10"></div>
              <div>
                <div class="text-1xl font-bold text-gray-900">{{ originCity }}</div>
                <div class="text-xs font-semibold text-gray-500">{{ originAirport }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-1xl font-bold text-gray-900">{{ depTime }}</div>
              <div class="text-xs text-gray-500">{{ depZone }}</div>
              <div class="text-xs font-semibold text-gray-500">{{ depDateLine }}</div>
            </div>
          </div>

          <!-- Travel time -->
          <div class="flex justify-center mb-6">
            <div class="text-xs font-medium text-gray-500">Travel time: {{ travelTimeStr }}</div>
          </div>

          <!-- Arrival -->
          <div class="flex items-start justify-between">
            <div class="flex items-start gap-4">
              <div class="w-4 h-4 bg-blue-600 rounded-full mt-1 relative z-10"></div>
              <div>
                <div class="text-1xl font-bold text-gray-900">{{ destCity }}</div>
                <div class="text-xs font-semibold  text-gray-500">{{ destAirport }}</div>
                <div class="text-xs font-semibold text-gray-500">{{ terminalInfo }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-1xl font-bold text-gray-900">{{ arrTime }}</div>
              <div class="text-xs text-gray-500">{{ arrZone }}</div>
              <div v-if="arrivalNote" class="text-sm text-red-500 font-medium">{{ arrivalNote }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Flight details grid -->
      <div class="space-y-4 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Aircraft</span>
          <span class="text-sm font-semibold text-gray-900">{{ aircraft }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Cabin</span>
          <span class="text-sm font-semibold text-gray-900">{{ cabin }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Distance</span>
          <span class="text-sm font-semibold text-gray-900">{{ distanceDisplay }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Traveller assistance</span>
          <a :href="travellerAssistUrl" class="text-blue-500 flex items-center gap-1 font-semibold text-sm">
            View info
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Amenities -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
        <div class="space-y-3">
          <div v-for="amenity in displayAmenities" :key="amenity.key" class="font-semibold text-sm flex items-center gap-3">
            <component :is="amenity.icon" class="w-5 h-5 text-gray-600" />
            <span class="text-gray-700">{{ amenity.label }}</span>
          </div>
        </div>
      </div>

      <!-- QR Code + PDF + Passengers -->
      <div class="border-t pt-4 flex items-start gap-4">
        <div class="flex-shrink-0">
          <img 
            v-if="ticket?.barcodeUrl" 
            :src="ticket.barcodeUrl" 
            alt="Boarding pass QR code" 
            class="w-24 h-24 bg-white border border-gray-200 rounded p-1" 
          />
          <div v-else class="w-24 h-24 bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <div class="flex-1 text-sm">
          <div class="font-semibold text-gray-900 mb-2">Passengers</div>
          <div v-for="passenger in booking.passengers || []" :key="passenger.name" class="text-gray-700 mb-1">
            {{ passenger.name }} <span class="text-gray-500">• {{ passenger.passport || '-' }}</span>
          </div>

          <div class="mt-4">
            <div class="flex gap-2 mb-2">
            <a 
              v-if="ticket?.eTicketPdfUrl" 
              :href="ticket.eTicketPdfUrl" 
              :download="`e-ticket-${ticket.bookingId || 'ticket'}.pdf`"
              class="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download e-ticket (PDF)
            </a>
              <button 
                v-else 
                disabled 
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500 cursor-not-allowed"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF not available
              </button>
            </div>
            <div class="text-xs text-gray-500">Show the QR or PDF at check-in.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';

const props = defineProps({
  booking: { type: Object, required: true },
  flight: { type: Object, required: true },
  ticket: { type: Object, default: null }
});

// Helper accessors for segment 0
const seg = computed(() => (props.flight.segments && props.flight.segments[0]) || {});
const originCity = computed(() => seg.value.origin?.city || seg.value.origin?.code || 'Los Angeles');
const originAirport = computed(() => `${seg.value.origin?.name || 'Los Angeles Intl'} (${seg.value.origin?.code || 'LAX'})`);
const destCity = computed(() => seg.value.destination?.city || seg.value.destination?.code || 'New York');
const destAirport = computed(() => `${seg.value.destination?.name || 'John F. Kennedy Intl'} (${seg.value.destination?.code || 'JFK'})`);

function fmtTime(iso, tz) {
  if (!iso) return '15:35';
  try {
    const dt = DateTime.fromISO(iso, { zone: 'utc' });
    if (tz) {
      return dt.setZone(tz).toFormat('HH:mm');
    }
    return dt.toFormat('HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error, iso, tz);
    return '15:35';
  }
}

function fmtZone(iso, tz) {
  if (!iso) return 'EDT';
  try {
    const dt = DateTime.fromISO(iso, { zone: 'utc' });
    if (tz) {
      return dt.setZone(tz).offsetNameShort;
    }
    return dt.offsetNameShort;
  } catch (error) {
    console.error('Error formatting timezone:', error, iso, tz);
    return 'EDT';
  }
}

function fmtDateLine(iso, tz) {
  if (!iso) return 'Mon, 1 Sept';
  try {
    const dt = DateTime.fromISO(iso, { zone: 'utc' });
    if (tz) {
      return dt.setZone(tz).toFormat('ccc, d LLL');
    }
    return dt.toFormat('ccc, d LLL');
  } catch (error) {
    console.error('Error formatting date:', error, iso, tz);
    return 'Mon, 1 Sept';
  }
}

const depTime = computed(() => fmtTime(seg.value.departureTime, seg.value.departureTimezone));
const depZone = computed(() => fmtZone(seg.value.departureTime, seg.value.departureTimezone));
const depDateLine = computed(() => fmtDateLine(seg.value.departureTime, seg.value.departureTimezone));
const arrTime = computed(() => fmtTime(seg.value.arrivalTime, seg.value.arrivalTimezone));
const arrZone = computed(() => fmtZone(seg.value.arrivalTime, seg.value.arrivalTimezone));

const aircraft = computed(() => seg.value.aircraft || props.flight?.aircraft || 'Boeing 777-200');
const cabin = computed(() => seg.value.cabin || 'Economy');

const terminalInfo = computed(() => {
  const term = seg.value.terminalDestination;
  return term ? `Terminal ${term}` : '';
});

const travelTimeStr = computed(() => {
  let mins = seg.value.travelTimeMinutes;
  if (!mins && seg.value.departureTime && seg.value.arrivalTime) {
    try {
      const start = DateTime.fromISO(seg.value.departureTime, { zone: 'utc' });
      const end = DateTime.fromISO(seg.value.arrivalTime, { zone: 'utc' });
      mins = Math.round(end.diff(start).as('minutes'));
    } catch (error) {
      console.error('Error calculating travel time:', error);
      return '7h 55m';
    }
  }
  if (!mins) return '7h 55m';
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
});

const arrivalNote = computed(() => {
  if (!seg.value.departureTime || !seg.value.arrivalTime) return 'Arrives Tue, 2 Sept';
  try {
    const dep = DateTime.fromISO(seg.value.departureTime, { zone: 'utc' });
    const arr = DateTime.fromISO(seg.value.arrivalTime, { zone: 'utc' });
    
    // Apply timezones if available
    const depWithTz = seg.value.departureTimezone ? dep.setZone(seg.value.departureTimezone) : dep;
    const arrWithTz = seg.value.arrivalTimezone ? arr.setZone(seg.value.arrivalTimezone) : arr;
    
    if (depWithTz.hasSame(arrWithTz, 'day')) return '';
    return `Arrives ${arrWithTz.toFormat('ccc, d LLL')}`;
  } catch (error) {
    console.error('Error formatting arrival note:', error);
    return 'Arrives Tue, 2 Sept';
  }
});

const distanceDisplay = computed(() => {
  const d = seg.value.distanceKm || props.flight?.distanceKm;
  return d ? `${d} km` : '6597 km';
});

const travellerAssistUrl = computed(() => props.flight?.metadata?.assistanceUrl || '/bookings');

// Amenities with icons
const displayAmenities = computed(() => {
  const amenities = props.flight.amenities || ['wifi', 'inseat_power', 'inflight_entertainment'];
  return amenities.map(amenity => ({
    key: amenity,
    label: getAmenityLabel(amenity),
    icon: getAmenityIcon(amenity)
  }));
});

function getAmenityLabel(amenity) {
  const labels = {
    wifi: 'WiFi',
    inseat_power: 'In-seat power outlet',
    inflight_entertainment: 'In-flight entertainment',
    meals: 'Meals'
  };
  return labels[amenity] || amenity.replace(/_/g, ' ');
}

function getAmenityIcon(amenity) {
  // Return template string for inline SVG components
  const icons = {
    wifi: 'WifiIcon',
    inseat_power: 'PowerIcon', 
    inflight_entertainment: 'EntertainmentIcon',
    meals: 'MealsIcon'
  };
  return icons[amenity] || 'DefaultIcon';
}

// Icon components
const WifiIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  `
};

const PowerIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  `
};

const EntertainmentIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  `
};

const MealsIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  `
};

const DefaultIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
    </svg>
  `
};
</script>

<style scoped>
/* Additional mobile-optimized styles */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
    margin: 0;
  }
}
</style>