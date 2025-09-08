<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Flight Details</h1>
            <p class="text-gray-600 mt-2">Review flight information and select your fare class</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="$router.push('/flights')" 
              class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to Flights
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20 bg-white rounded-xl shadow-md">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading flight details...</p>
        </div>
      </div>

      <!-- Flight Details -->
      <div v-else-if="flight" class="space-y-6">
        <!-- Flight Summary Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ flight.flightNumber }} — {{ flight.origin.code }} → {{ flight.destination.code }}</h2>
              <p class="text-gray-600 mt-1">{{ flight.origin.name }} → {{ flight.destination.name }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <span :class="statusBadgeClass(flight.status)" class="text-xs px-3 py-1 rounded-full font-medium">
                {{ flight.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Departure Information -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-sm text-blue-600 font-medium mb-2">Departure</div>
              <div class="text-2xl font-bold text-blue-800">{{ flight.origin.code }}</div>
              <div class="text-gray-700">{{ flight.origin.name }}</div>
              <div class="text-gray-600">{{ flight.origin.city }}, {{ flight.origin.country }}</div>
              <div class="mt-3">
                <div class="text-sm text-gray-500">Date & Time</div>
                <div class="text-lg font-semibold text-gray-900">
                  {{ new Date(flight.departureTime).toLocaleDateString() }}
                </div>
                <div class="text-lg font-semibold text-gray-900">
                  {{ new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </div>
              </div>
            </div>
            
            <!-- Arrival Information -->
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-sm text-green-600 font-medium mb-2">Arrival</div>
              <div class="text-2xl font-bold text-green-800">{{ flight.destination.code }}</div>
              <div class="text-gray-700">{{ flight.destination.name }}</div>
              <div class="text-gray-600">{{ flight.destination.city }}, {{ flight.destination.country }}</div>
              <div class="mt-3">
                <div class="text-sm text-gray-500">Date & Time</div>
                <div class="text-lg font-semibold text-gray-900">
                  {{ new Date(flight.arrivalTime).toLocaleDateString() }}
                </div>
                <div class="text-lg font-semibold text-gray-900">
                  {{ new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Flight Duration</div>
                <div class="font-medium">{{ calculateDuration(flight.departureTime, flight.arrivalTime) }}</div>
              </div>
            </div>
            
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Total Seats</div>
                <div class="font-medium">{{ flight.totalSeats }}</div>
              </div>
            </div>
            
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Available Seats</div>
                <div class="font-medium">{{ totalAvailableSeats }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fare Classes Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Available Fare Classes</h2>
          <p class="text-gray-600 mb-6">Select a fare class that suits your travel needs</p>
          
          <ul class="space-y-4">
            <li v-for="fc in flight.fareClasses" :key="fc.name" class="bg-gray-50 hover:bg-indigo-50 p-5 rounded-lg border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
              <div class="flex flex-col md:flex-row md:justify-between md:items-center">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <span class="text-lg font-semibold text-gray-800 capitalize">{{ fc.name }}</span>
                    <span :class="seatsAvailabilityClass(fc.seatsAvailable)" class="text-xs px-2 py-1 rounded-full ml-3">
                      {{ fc.seatsAvailable }} seats available
                    </span>
                  </div>
                  
                  <div class="flex flex-wrap gap-4 mt-3">
                    <div class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                      </svg>
                      Price: <span class="font-semibold ml-1">{{ fc.price }} {{ 'USD' }}</span>
                    </div>
                    
                    <div class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                      </svg>
                      <span v-if="fc.name === 'economy'">Basic amenities</span>
                      <span v-else-if="fc.name === 'business'">Premium amenities</span>
                      <span v-else>Standard amenities</span>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4 md:mt-0 md:ml-6">
                  <button 
                    @click="book(fc)" 
                    class="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 min-w-[120px]"
                    :disabled="fc.seatsAvailable === 0"
                    :class="{'opacity-50 cursor-not-allowed': fc.seatsAvailable === 0}"
                  >
                    <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M1 4h14l-1.5 7H5a2 2 0 100 4h8a2 2 0 100-4h1.5l.5-2H3a1 1 0 00-1-1zm3.5 3h9L13 5H5.5l-1 2zM6 16a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    {{ fc.seatsAvailable === 0 ? 'Sold Out' : 'Book Now' }}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFlight } from '../services/flights.service';
import { useBookingStore } from '../stores/booking';

const route = useRoute();
const router = useRouter();
const booking = useBookingStore();
const flight = ref(null);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const res = await getFlight(route.params.id);
    flight.value = res.data;
  } catch (err) {
    alert(err?.response?.data?.message || err.message || 'Failed to load flight');
  } finally {
    loading.value = false;
  }
}

function book(fareClass) {
  if (fareClass.seatsAvailable === 0) return;
  
  booking.currentFlight = flight.value;
  booking.selectedFareClass = fareClass.name;
  booking.passengerCount = 1;
  booking.passengers = [];
  booking.seats = [];
  // push to booking flow UI
  router.push({ name: 'BookingFlow' });
}

function calculateDuration(departureTime, arrivalTime) {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);
  const durationMs = arrival - departure;
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

function statusBadgeClass(status) {
  const statusClasses = {
    'scheduled': 'bg-blue-100 text-blue-800',
    'boarding': 'bg-yellow-100 text-yellow-800',
    'departed': 'bg-green-100 text-green-800',
    'delayed': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

function seatsAvailabilityClass(seatsAvailable) {
  if (seatsAvailable === 0) return 'bg-red-100 text-red-800';
  if (seatsAvailable < 10) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

const totalAvailableSeats = computed(() => {
  if (!flight.value?.fareClasses) return 0;
  return flight.value.fareClasses.reduce((total, fc) => total + fc.seatsAvailable, 0);
});

load();
</script>