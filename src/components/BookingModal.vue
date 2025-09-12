<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold">Book Flight — {{ flight.flightNumber }}</h3>
            <p class="text-blue-100 text-sm mt-1">{{ flight.airline?.name || flight.airline?.code || 'Flight' }}</p>
          </div>
          <button @click="close" class="text-white hover:text-blue-200 p-1 rounded-full hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="p-5 max-h-[70vh] overflow-y-auto">
        <div class="space-y-5">
          <!-- Fare Class Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Fare Class</label>
            <select v-model="selectedFare" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option v-for="fc in flight.fareClasses || []" :key="fc.name" :value="fc.name">
                {{ fc.name }} — {{ formatCurrency(fc.price) }} — {{ fc.seatsAvailable }} seats available
              </option>
            </select>
          </div>

          <!-- Passenger Information -->
          <div class="bg-slate-50 p-4 rounded-lg">
            <h4 class="text-lg font-medium text-slate-800 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Passenger Information
            </h4>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input v-model="passenger.name" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Enter full name" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input v-model="passenger.dob" type="date" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Passport Number</label>
                  <input v-model="passenger.passport" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Passport number" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input v-model="passenger.email" type="email" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="email@example.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input v-model="passenger.phone" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
            </div>
          </div>

          <!-- Seat Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Seat Selection (Optional)</label>
            <input v-model="seat" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., 12A" />
          </div>

          <!-- Total and Actions -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div>
              <div class="text-sm text-slate-500">Total Fare</div>
              <div class="text-2xl font-bold text-blue-600">{{ formatCurrency(totalFare) }}</div>
            </div>

            <div class="flex gap-2 w-full sm:w-auto">
              <button @click="close" class="px-5 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg font-medium transition-colors w-full sm:w-auto">
                Cancel
              </button>
              <button 
                @click="submit" 
                :disabled="submitting" 
                class="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 w-full sm:w-auto disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <svg v-if="submitting" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Processing...' : 'Confirm Booking' }}
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { DateTime } from 'luxon';
import { createBooking } from '../services/bookings.service';

const props = defineProps({
  open: { type: Boolean, default: false },
  flight: { type: Object, required: true },
  defaultFare: { type: String, default: '' }
});
const emits = defineEmits(['close', 'booked']);

const selectedFare = ref(props.defaultFare || (props.flight.fareClasses?.[0]?.name || ''));
const passenger = ref({ name: '', dob: '', passport: '', email: '', phone: '' });
const seat = ref('');
const submitting = ref(false);
const error = ref(null);

watch(() => props.defaultFare, (v) => { if (v) selectedFare.value = v; });

const fareObj = computed(() => {
  return (props.flight.fareClasses || []).find(f => f.name === selectedFare.value) || props.flight.fareClasses?.[0] || { price: 0 };
});

const totalFare = computed(() => fareObj.value?.price || props.flight?.fare || 0);

function formatCurrency(v) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v || 0);
}

function close() {
  error.value = null;
  emits('close');
}

async function submit() {
  error.value = null;
  if (!passenger.value.name) {
    error.value = 'Passenger name is required';
    return;
  }
  submitting.value = true;
  try {
    // build booking payload (single passenger)
    const payload = {
      flightId: props.flight._id,
      fareClass: selectedFare.value,
      passengers: [ { ...passenger.value } ],
      seats: seat.value ? [seat.value] : [],
      fare: totalFare.value,
      paymentMethod: 'in_person' // default
    };
    const res = await createBooking(payload);
    // Expect res.data has booking
    emits('booked', res.data || res);
    close();
  } catch (err) {
    console.error('createBooking error', err);
    error.value = err?.response?.data?.message || err?.message || 'Booking failed';
  } finally {
    submitting.value = false;
  }
}
</script>