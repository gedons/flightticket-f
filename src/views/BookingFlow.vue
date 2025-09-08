<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Complete Your Booking</h1>
        <p class="text-gray-600 mt-2">Finalize your flight reservation by providing passenger details</p>
      </div>

      <!-- No Flight Selected -->
      <div v-if="!booking.currentFlight" class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-lg font-medium text-yellow-800">No flight selected</h3>
            <p class="text-yellow-700 mt-1">Please select a flight to continue with your booking</p>
            <router-link to="/flights" class="inline-flex items-center mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition duration-200">
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Search Flights
            </router-link>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <div v-else class="bg-white rounded-xl shadow-md p-6 mb-6">
        <!-- Flight Summary -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
          <h2 class="text-xl font-semibold text-blue-800 mb-3">Flight Summary</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div class="text-sm text-blue-600 font-medium mb-1">Departure</div>
              <div class="text-lg font-bold text-blue-800">{{ booking.currentFlight.origin.code }}</div>
              <div class="text-gray-700">{{ booking.currentFlight.origin.name }}</div>
              <div class="text-gray-600">{{ booking.currentFlight.origin.city }}, {{ booking.currentFlight.origin.country }}</div>
            </div>
            
            <div>
              <div class="text-sm text-blue-600 font-medium mb-1">Arrival</div>
              <div class="text-lg font-bold text-blue-800">{{ booking.currentFlight.destination.code }}</div>
              <div class="text-gray-700">{{ booking.currentFlight.destination.name }}</div>
              <div class="text-gray-600">{{ booking.currentFlight.destination.city }}, {{ booking.currentFlight.destination.country }}</div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Flight Number</div>
                <div class="font-medium">{{ booking.currentFlight.flightNumber }}</div>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Fare Class</div>
                <div class="font-medium capitalize">{{ booking.selectedFareClass }}</div>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Passengers</div>
                <div class="flex items-center">
                  <input 
                    type="number" 
                    v-model.number="passCount" 
                    min="1" 
                    class="w-16 p-1 border rounded text-center mr-2" 
                  />
                  <span class="text-sm">person(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Passenger Details Form -->
        <form @submit.prevent="onSubmit" class="space-y-6">
          <div class="border-b border-gray-200 pb-4">
            <h2 class="text-xl font-semibold text-gray-800">Passenger Details</h2>
            <p class="text-gray-600 text-sm mt-1">Enter information for all passengers</p>
          </div>

          <div v-for="n in passCount" :key="n" class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-indigo-600 font-medium">{{ n }}</span>
              </div>
              <h3 class="text-lg font-medium text-gray-800">Passenger {{ n }}</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input 
                  v-model="passengers[n - 1].name" 
                  placeholder="Enter full name" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                  required 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                <input 
                  v-model="passengers[n - 1].passport" 
                  placeholder="Enter passport number (optional)" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                />
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  v-model="passengers[n - 1].email" 
                  type="email" 
                  placeholder="Enter email address (optional)" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
                />
              </div>
            </div>
          </div>

          <!-- Seat Selection -->
          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 class="text-lg font-medium text-gray-800 mb-3">Seat Selection</h3>
            <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Seat Numbers (optional)</label>
            <p class="text-sm text-gray-500 mb-3">Enter comma-separated seat numbers (e.g., 12A, 12B, 12C)</p>
            <input 
              v-model="seatInput" 
              placeholder="e.g. 12A, 12B, 12C" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200" 
            />
          </div>

          <!-- Payment Summary -->
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
            <h3 class="text-lg font-medium text-indigo-800 mb-3">Payment Summary</h3>
            
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-700">Fare per passenger:</span>
              <span class="font-medium">
                {{ farePerPassenger }} {{ 'USD' }}
              </span>
            </div>
            
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-700">Number of passengers:</span>
              <span class="font-medium">{{ passCount }}</span>
            </div>
            
            <div class="border-t border-indigo-200 pt-2 mt-2">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-800">Total Amount:</span>
                <span class="text-xl font-bold text-indigo-700">{{ totalFareDisplay }}</span>
              </div>
            </div>
            
            <p class="text-sm text-indigo-600 mt-3">Payment will be completed at the counter after booking confirmation</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4 pt-4">
            <button 
              type="button" 
              @click="cancel" 
              class="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Cancel Booking
            </button>
            
            <button 
              type="submit" 
              class="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBookingStore } from '../stores/booking';
import { createBooking } from '../services/bookings.service';

const booking = useBookingStore();
const router = useRouter();

// Primitive passenger count must be a ref (not reactive)
const passCount = ref(booking.passengerCount || 1);

// Passengers array as a ref of objects
const passengers = ref([]);

// Seat input string
const seatInput = ref('');

// Initialize passengers array to match initial passCount
function ensurePassengersSize(n) {
  const count = Math.max(1, Number(n) || 1);
  while (passengers.value.length < count) {
    passengers.value.push({ name: '', passport: '', email: '' });
  }
  while (passengers.value.length > count) {
    passengers.value.pop();
  }
}

// keep local passengers length in sync with passCount
ensurePassengersSize(passCount.value);
watch(passCount, (newVal) => {
  ensurePassengersSize(newVal);
});

// Keep booking.passengerCount in sync so other pages (if any) can see it
watch(passCount, (v) => {
  booking.passengerCount = Number(v) || 1;
});

// Calculate fare per passenger
const farePerPassenger = computed(() => {
  const fc = booking.currentFlight?.fareClasses?.find(f => f.name === booking.selectedFareClass);
  return fc?.price || 0;
});

// total fare computed from selected fare class
const totalFare = computed(() => {
  return farePerPassenger.value * (Number(passCount.value) || 1);
});

const totalFareDisplay = computed(() => `${totalFare.value} ${import.meta.env.VITE_CURRENCY || 'USD'}`);

// cancel booking flow
function cancel() {
  booking.reset();
  router.push('/');
}

// submit booking
async function onSubmit() {
  try {
    // basic validation
    if (!booking.currentFlight || !booking.selectedFareClass) {
      alert('No flight or fare class selected.');
      return;
    }
    const seats = seatInput.value ? seatInput.value.split(',').map(s => s.trim()).filter(Boolean) : [];
    const payload = {
      flightId: booking.currentFlight._id,
      fareClass: booking.selectedFareClass,
      passengerCount: Number(passCount.value) || 1,
      passengers: passengers.value.map(p => ({ name: p.name, passport: p.passport, email: p.email })),
      seats
      // paymentMethod omitted => defaults to in_person
    };

    const res = await createBooking(payload);
    const bookingId = res.data.bookingId;
    alert(`Booking created (pending). Booking ID: ${bookingId}\nPay at counter to confirm, or ask admin to mark paid.`);
    booking.reset();
    router.push({ name: 'BookingsList' });
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || err.message || 'Failed to create booking');
  }
}
</script>