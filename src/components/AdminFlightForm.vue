<template>
  <div class="bg-white p-4 rounded shadow">
    <h3 class="text-lg font-semibold mb-3">{{ isEdit ? 'Edit Flight' : 'Create Flight' }}</h3>
    <form @submit.prevent="submit" class="space-y-3">
      <input v-model="form.flightNumber" placeholder="Flight Number" class="w-full p-2 border rounded" required />
      <div class="grid grid-cols-2 gap-2">
        <input v-model="form.origin.code" placeholder="Origin IATA" class="p-2 border rounded" required />
        <input v-model="form.destination.code" placeholder="Destination IATA" class="p-2 border rounded" required />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input v-model="form.departureTime" type="datetime-local" class="p-2 border rounded" required />
        <input v-model="form.arrivalTime" type="datetime-local" class="p-2 border rounded" required />
      </div>

      <input v-model.number="form.totalSeats" type="number" placeholder="Total Seats" class="w-full p-2 border rounded" required />

      <div>
        <label class="block text-sm mb-1">Fare classes (JSON)</label>
        <textarea v-model="fareJson" rows="4" class="w-full p-2 border rounded" />
        <div class="text-xs text-slate-500 mt-1">Example: [{"name":"economy","price":500,"seatsAvailable":100}]</div>
      </div>

      <div class="flex gap-2">
        <button class="px-3 py-2 bg-sky-600 text-white rounded" :disabled="loading">{{ isEdit ? 'Update' : 'Create' }}</button>
        <button type="button" @click="$emit('cancel')" class="px-3 py-2 border rounded">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { toRaw } from 'vue';

const props = defineProps({
  model: { type: Object, default: null } // existing flight for edit
});
const emit = defineEmits(['saved','cancel']);

const isEdit = !!props.model;
const loading = ref(false);

const form = reactive({
  flightNumber: props.model?.flightNumber || '',
  origin: props.model?.origin ? { ...props.model.origin } : { code: '', name: '' },
  destination: props.model?.destination ? { ...props.model.destination } : { code: '', name: '' },
  departureTime: props.model?.departureTime ? new Date(props.model.departureTime).toISOString().slice(0,16) : '',
  arrivalTime: props.model?.arrivalTime ? new Date(props.model.arrivalTime).toISOString().slice(0,16) : '',
  totalSeats: props.model?.totalSeats || 0,
  fareClasses: props.model?.fareClasses || [],
  metadata: props.model?.metadata || {}
});

const fareJson = ref(JSON.stringify(form.fareClasses || [], null, 2));
watch(fareJson, (v) => {
  try {
    form.fareClasses = JSON.parse(v || '[]');
  } catch (e) {
    // ignore invalid JSON until submit
  }
});

async function submit() {
  loading.value = true;
  try {
    // Basic validation: ensure fareClasses parse ok
    try {
      form.fareClasses = JSON.parse(fareJson.value || '[]');
    } catch (e) {
      alert('Invalid fare classes JSON');
      loading.value = false;
      return;
    }

    // convert datetime-local to ISO
    const payload = {
      flightNumber: form.flightNumber,
      origin: { ...form.origin, code: (form.origin.code || '').trim().toUpperCase() },
      destination: { ...form.destination, code: (form.destination.code || '').trim().toUpperCase() },
      departureTime: new Date(form.departureTime).toISOString(),
      arrivalTime: new Date(form.arrivalTime).toISOString(),
      totalSeats: Number(form.totalSeats),
      fareClasses: form.fareClasses,
      metadata: form.metadata
    };
    emit('saved', payload);
  } finally {
    loading.value = false;
  }
}
</script>
