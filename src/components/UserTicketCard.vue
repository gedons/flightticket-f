<template>
  <div class="bg-white p-4 rounded shadow flex items-start gap-4">
    <div v-if="ticket.barcodeUrl" class="flex-shrink-0">
      <img :src="ticket.barcodeUrl" alt="QR" class="w-28 h-28 object-contain bg-white p-1 rounded" />
    </div>

    <div class="flex-1">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">PNR</div>
          <div class="font-semibold">{{ booking?.pnr || ticket?.pnr || '-' }}</div>
        </div>

        <div class="text-right">
          <div class="text-sm text-slate-500">Issued</div>
          <div class="text-sm">{{ issuedLocal }}</div>
        </div>
      </div>

      <div class="mt-3 text-sm text-slate-600">
        <div><strong>Seats:</strong> {{ booking?.seats?.join(', ') || '-' }}</div>
        <div class="mt-1"><strong>Download:</strong> <button @click="$emit('download', ticket)" class="text-sky-600 underline">PDF</button></div>
      </div>
    </div>

    <!-- <div class="flex flex-col gap-2 items-end">
      <button @click="$emit('view', ticket)" class="px-3 py-2 border rounded text-sm">View</button>
    </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';

const props = defineProps({
  ticket: { type: Object, required: true },
  booking: { type: Object, default: null }
});

const issuedLocal = computed(() => {
  try {
    return DateTime.fromISO(props.ticket.issuedAt).toLocaleString(DateTime.DATETIME_MED);
  } catch {
    return props.ticket.issuedAt || '-';
  }
});
</script>
