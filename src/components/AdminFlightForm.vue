<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-800">{{ isEdit ? 'Edit Flight' : 'Create New Flight' }}</h3>
      <button 
        @click="$emit('cancel')" 
        class="text-gray-400 hover:text-gray-600 transition duration-200"
        aria-label="Close form"
      >
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6极客时间l12 12" />
        </svg>
      </button>
    </div>

    <form @submit.prevent="submit" class="space-y-5">
      <!-- Flight Number -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Flight Number *</label>
        <input 
          v-model="form.flightNumber" 
          placeholder="e.g., FR123, BA456" 
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
          required 
        />
      </div>

      <!-- Origin and Destination -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Origin Airport Code *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              v-model="form.origin.code" 
              placeholder="e.g., LAG, ABV" 
              class="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 uppercase" 
              required 
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Destination Airport Code *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 极客时间9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4极客时间z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              v-model="form.destination.code" 
              placeholder="e.g., LAG, ABV" 
              class="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 uppercase" 
              required 
            />
          </div>
        </div>
      </div>

      <!-- Departure and Arrival Times -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Departure Time *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              v-model="form.departureTime" 
              type="datetime-local" 
              class="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
              required 
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Arrival Time *</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              v-model="form.arrivalTime" 
              type="datetime-local" 
              class="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
              required 
            />
          </div>
        </div>
      </div>

      <!-- Total Seats -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Total Seats *</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 极客时间20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5极客时间v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
          <input 
            v-model.number="form.totalSeats" 
            type="number" 
            min="1"
            placeholder="Total number of seats" 
            class="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
            required 
          />
        </div>
      </div>

      <!-- Fare Classes -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Fare Classes (JSON) *</label>
        <div class="relative">
          <textarea 
            v-model="fareJson" 
            rows="6" 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 font-mono text-sm" 
            :class="{'border-red-500': jsonError}"
          />
          <div v-if="jsonError" class="text-red-500 text-xs mt-1">{{ jsonError }}</div>
          <div class="text-xs text-gray-500 mt-2">
            Example: <code class="bg-gray-100 p-1 rounded">[{"name":"economy","price":500,"seatsAvailable":100}]</code>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="px-5 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition duration-200"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          :disabled="loading" 
          class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isEdit ? 'Update Flight' : 'Create Flight' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  model: { type: Object, default: null } // existing flight for edit
});
const emit = defineEmits(['saved','cancel']);

const isEdit = !!props.model;
const loading = ref(false);
const jsonError = ref('');

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
    jsonError.value = '';
  } catch (e) {
    // ignore invalid JSON until submit
  }
});

async function submit() {
  loading.value = true;
  jsonError.value = '';
  
  try {
    // Basic validation: ensure fareClasses parse ok
    try {
      form.fareClasses = JSON.parse(fareJson.value || '[]');
    } catch (e) {
      jsonError.value = 'Invalid JSON format for fare classes';
      loading.value = false;
      return;
    }

    // Validate fare classes structure
    if (!Array.isArray(form.fareClasses)) {
      jsonError.value = 'Fare classes must be an array';
      loading.value = false;
      return;
    }

    for (const fc of form.fareClasses) {
      if (!fc.name || typeof fc.price !== 'number' || typeof fc.seatsAvailable !== 'number') {
        jsonError.value = 'Each fare class must have name (string), price (number), and seatsAvailable (number)';
        loading.value = false;
        return;
      }
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