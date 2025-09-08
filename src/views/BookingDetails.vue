<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Booking Details</h1>
            <div v-if="booking" class="flex items-center mt-2">
              <span class="text-gray-600 mr-4">PNR: {{ booking.pnr || booking._id }}</span>
              <span :class="statusBadgeClass(booking.status)" class="text-xs px-3 py-1 rounded-full font-medium">
                {{ booking.status }}
              </span>
            </div>
            <div v-else class="h-6 bg-gray-200 animate-pulse rounded w-48 mt-2"></div>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="$router.push('/bookings')" 
              class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to Bookings
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20 bg-white rounded-xl shadow-md">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>

      <!-- Booking Content -->
      <div v-else-if="booking" class="space-y-6">
        <!-- Flight Information Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Flight Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Origin -->
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-sm text-blue-600 font-medium mb-2">Departure</div>
              <div class="text-2xl font-bold text-blue-800">{{ booking.flightId?.origin?.code }}</div>
              <div class="text-gray-700">{{ booking.flightId?.origin?.name }}</div>
              <div class="text-gray-600">{{ booking.flightId?.origin?.city }}, {{ booking.flightId?.origin?.country }}</div>
              <div class="mt-2 text-sm font-medium text-gray-800">
                {{ booking.flightId?.departureTime ? new Date(booking.flightId.departureTime).toLocaleDateString() : '' }}
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ booking.flightId?.departureTime ? new Date(booking.flightId.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' }}
              </div>
            </div>
            
            <!-- Destination -->
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-sm text-green-600 font-medium mb-2">Arrival</div>
              <div class="text-2xl font-bold text-green-800">{{ booking.flightId?.destination?.code }}</div>
              <div class="text-gray-700">{{ booking.flightId?.destination?.name }}</div>
              <div class="text-gray-600">{{ booking.flightId?.destination?.city }}, {{ booking.flightId?.destination?.country }}</div>
              <div class="mt-2 text-sm font-medium text-gray-800">
                {{ booking.flightId?.arrivalTime ? new Date(booking.flightId.arrivalTime).toLocaleDateString() : '' }}
              </div>
              <div class="text-lg font-semibold text-gray-900">
                {{ booking.flightId?.arrivalTime ? new Date(booking.flightId.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '' }}
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Flight Number</div>
                <div class="font-medium">{{ booking.flightId?.flightNumber }}</div>
              </div>
            </div>
            
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Class</div>
                <div class="font-medium capitalize">{{ booking.fareClass }}</div>
              </div>
            </div>
            
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <div>
                <div class="text-xs text-gray-500">Seats</div>
                <div class="font-medium">{{ booking.seats?.join(', ') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Passenger Information Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Passenger Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(p, index) in booking.passengers" :key="index" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center mb-3">
                <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-indigo-600 font-medium">{{ index + 1 }}</span>
                </div>
                <h3 class="font-medium text-gray-800">{{ p.name }}</h3>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-600">Email: {{ p.email }}</span>
                </div>
                
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-600">Passport: {{ p.passport || 'Not provided' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment & Booking Details Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Payment & Booking Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Booking Information</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Booking Date:</span>
                  <span class="font-medium">{{ new Date(booking.createdAt).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Last Updated:</span>
                  <span class="font-medium">{{ new Date(booking.updatedAt).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Passengers:</span>
                  <span class="font-medium">{{ booking.passengerCount }}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span :class="paymentStatusBadgeClass(booking.paymentStatus)" class="text-xs px-2 py-1 rounded-full font-medium">
                    {{ booking.paymentStatus }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Method:</span>
                  <span class="font-medium capitalize">{{ booking.paymentMethod?.replace('_', ' ') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Fare:</span>
                  <span class="font-medium text-green-600">${{ booking.fare }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ticket Information Card -->
        <div v-if="ticket" class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">E-Ticket</h2>
          
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-green-700 font-medium">Ticket Issued: {{ new Date(ticket.issuedAt).toLocaleString() }}</span>
            </div>
            
            <div class="flex flex-col md:flex-row md:items-center gap-6">
              <div class="bg-white p-3 rounded-lg border border-green-200">
                <img :src="ticket.barcodeUrl" alt="Ticket QR Code" class="w-40 h-40 mx-auto" />
                <p class="text-center text-xs text-gray-500 mt-2">Scan for boarding</p>
              </div>
              
              <div class="flex flex-col gap-3">
                <a 
                  :href="ticket.eTicketPdfUrl" 
                  target="_blank" 
                  class="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition duration-200"
                >
                  <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Download E-Ticket PDF
                </a>
                
                <p class="text-sm text-gray-600">Your electronic ticket is ready for download. Please keep it accessible during your journey.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Booking Actions</h2>
          
          <div v-if="booking.status !== 'cancelled'" class="flex flex-col sm:flex-row gap-3">
            <button 
              @click="cancel" 
              class="flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 font-medium rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Cancel Booking
            </button>
            
            <router-link 
              :to="`/flights`" 
              class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Book Another Flight
            </router-link>
          </div>
          
          <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <span class="text-red-700">This booking has been cancelled.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getBooking, cancelBooking } from '../services/bookings.service';

const route = useRoute();
const router = useRouter();
const booking = ref(null);
const ticket = ref(null);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const res = await getBooking(route.params.id);
    // backend returns { booking, ticket } per our updates
    booking.value = res.data.booking || res.data;
    ticket.value = res.data.ticket || null;
  } catch (err) {
    alert(err?.response?.data?.message || err.message || 'Failed to load booking');
    router.push('/dashboard');
  } finally {
    loading.value = false;
  }
}

async function cancel() {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
  try {
    await cancelBooking(route.params.id);
    alert('Booking cancelled successfully');
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

function paymentStatusBadgeClass(status) {
  const statusClasses = {
    'paid': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'failed': 'bg-red-100 text-red-800',
    'refunded': 'bg-blue-100 text-blue-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

onMounted(load);
</script>