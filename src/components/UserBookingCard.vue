<template>
  <div class="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">PNR</div>
          <div class="font-semibold text-lg">{{ booking.pnr }}</div>
        </div>

        <div class="text-right">
          <div class="text-sm text-slate-500">Status</div>
          <div :class="statusClass">{{ booking.status || '-' }}</div>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <div class="text-xs text-slate-500">Fare Class</div>
          <div class="font-medium">{{ fareClass }}</div>
          <div class="text-xs text-slate-500">Departure: {{ departureLocal }}</div>
        </div>

        <div>
          <div class="text-xs text-slate-500">Passengers</div>
          <div class="text-sm">{{ passengerNames }}</div>

          <div class="text-xs text-slate-500 mt-2">Seats</div>
          <div class="text-sm">{{ booking.seats?.join(', ') || '-' }}</div>
        </div>
      </div>
    </div>

    <div class="mt-4 md:mt-0 md:ml-4 flex gap-2 items-center">
      <button @click="$emit('view', booking)" class="px-3 py-2 border rounded text-sm">View</button>
      <!-- <button v-if="ticket" @click="$emit('viewTicket', { ticket, booking })" class="px-3 py-2 bg-sky-600 text-white rounded text-sm">View Ticket</button> -->
      <button v-if="canCancel" @click="$emit('cancel', booking)" class="px-3 py-2 border text-red-600 rounded text-sm">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';
const props = defineProps({
  booking: { type: Object, required: true },
  ticket: { type: Object, default: null }
});

const flight = computed(() => props.booking.flight || props.booking.flightId || {});
const fareClass = computed(() => flight.value?.fareClass || flight.value?.flightNum || '-');
const seg0 = computed(() => flight.value?.segments?.[0] || {});

const fromTo = computed(() => {
  const o = seg0.value?.origin?.code || seg0.value?.origin || '-';
  const d = seg0.value?.destination?.code || seg0.value?.destination || '-';
  return `${o} → ${d}`;
});

const departureLocal = computed(() => {
  const dt = seg0.value?.departureTime || props.booking?.createdAt;
  if (!dt) return '-';
  try {
    const zone = seg0.value?.departureTimezone || undefined;
    return DateTime.fromISO(dt).setZone(zone).toLocaleString(DateTime.DATETIME_MED);
  } catch {
    return new Date(dt).toLocaleString();
  }
});

const passengerNames = computed(() => (props.booking.passengers || []).map(p => p.name).join(', '));

const canCancel = computed(() => String(props.booking.status || '').toLowerCase() === 'pending');

const statusClass = computed(() => {
  const s = String(props.booking.status || '').toLowerCase();
  if (s === 'confirmed') return 'text-green-600 font-semibold';
  if (s === 'cancelled') return 'text-red-600 font-semibold';
  if (s === 'pending') return 'text-amber-600 font-semibold';
  return 'text-slate-600';
});
</script>
