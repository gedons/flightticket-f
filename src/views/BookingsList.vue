<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">My Bookings</h1>
            <p class="text-gray-600 mt-2">Manage your flight reservations and tickets</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="load" 
              class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20 bg-white rounded-xl shadow-md">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-700">No bookings found</h3>
        <p class="mt-2 text-gray-500">You haven't made any bookings yet</p>
        <router-link 
          to="/flights" 
          class="inline-flex items-center mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Search Flights
        </router-link>
      </div>

      <!-- Bookings List -->
      <ul v-else class="space-y-4">
        <li v-for="b in bookings" :key="b._id" class="bg-white hover:bg-indigo-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div class="flex flex-col md:flex-row md:justify-between">
            <div class="flex-1">
              <!-- Header with PNR and Status -->
              <div class="flex flex-wrap items-center gap-3 mb-4">
                <div class="font-semibold text-lg text-gray-800">PNR: {{ b.pnr || '—' }}</div>
                <span :class="statusBadgeClass(b.status)" class="text-xs px-3 py-1 rounded-full font-medium">
                  {{ b.status }}
                </span>
              </div>
              
              <!-- Flight Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
                  </svg>
                  <span class="text-sm">
                    Flight: <span class="font-medium">{{ b.flightId?.flightNumber || b.flightId }}</span>
                  </span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm">
                    Passengers: <span class="font-medium">{{ b.passengers.length }}</span>
                  </span>
                </div>
              </div>
              
              <!-- Passenger Names -->
              <div class="mb-4">
                <div class="text-sm text-gray-500 mb-1">Passenger Names:</div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(p, index) in b.passengers" :key="index" class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {{ p.name }}
                  </span>
                </div>
              </div>
              
              <!-- Ticket Download -->
              <div v-if="b.ticket" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-green-700">Ticket ready for download</span>
                </div>
                <a 
                  :href="b.ticket.eTicketPdfUrl" 
                  target="_blank" 
                  class="inline-flex items-center mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition duration-200"
                >
                  <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Download E-Ticket
                </a>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2 min-w-[140px]">
              <router-link 
                :to="{ name: 'BookingDetails', params: { id: b._id } }" 
                class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                Details
              </router-link>
              
              <button 
                @click="cancel(b._id)" 
                class="flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg transition duration-200"
                :disabled="b.status === 'cancelled'"
                :class="{'opacity-50 cursor-not-allowed': b.status === 'cancelled'}"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ b.status === 'cancelled' ? 'Cancelled' : 'Cancel' }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listUserBookings, cancelBooking } from '../services/bookings.service';
import { useRouter } from 'vue-router';

const bookings = ref([]);
const loading = ref(false);
const router = useRouter();

async function load() {
  loading.value = true;
  try {
    const res = await listUserBookings();
    bookings.value = res.data;
  } catch (err) {
    alert(err?.response?.data?.message || err.message || 'Failed to load bookings');
  } finally {
    loading.value = false;
  }
}

async function cancel(id) {
  if (!confirm('Are you sure you want to cancel this booking? This action will release the reserved seats.')) return;
  try {
    await cancelBooking(id);
    alert('Cancellation requested successfully');
    load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message || 'Cancel failed');
  }
}

function statusBadgeClass(status) {
  const statusClasses = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'completed': 'bg-blue-100 text-blue-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

onMounted(load);
</script>