<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">E-Ticket</h1>
            <p class="text-gray-600 mt-2">Your electronic boarding pass</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="$router.push('/tickets')" 
              class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to Tickets
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20 bg-white rounded-xl shadow-md">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>

      <!-- Ticket Content -->
      <div v-else-if="ticket && booking" class="space-y-6">
        <!-- Ticket Header Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Booking Reference</h2>
              <h2 class="text-xs font-semibold text-green-800">American Airlines</h2>
              <div class="text-3xl font-bold text-indigo-600 mt-1">{{ booking.pnr || '—' }}</div>
            </div>
            <div class="mt-4 md:mt-0">
              <span :class="statusBadgeClass(booking.status)" class="text-sm px-3 py-1 rounded-full font-medium">
                {{ booking.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Flight Information Card -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden">
          <!-- American Airlines Branding -->
          <div class="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-between px-6">
            <div class="flex items-center space-x-2">
              <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-2-1-8 4-8-4-2 1z"/>
              </svg>
              <span class="text-2xl font-bold text-white">American Airlines</span>
            </div>
            <!-- <div class="text-white text-sm font-medium">Flight Reservation</div> -->
          </div>
          
          <div class="mt-20">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Flight Information</h2>          
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <!-- Origin -->
              <div class="bg-blue-50 p-5 rounded-xl border border-blue-100 transform hover:scale-105 transition-transform duration-200">
                <div class="text-sm text-blue-700 font-semibold mb-3">Departure</div>
                <div class="text-sm font-semibold text-blue-900">{{ booking.flight.origin.code }}</div>
                <div class="text-gray-700 font-medium">{{ booking.flight.origin.name }}</div>
                <div class="text-gray-600 text-sm">{{ booking.flight.origin.city }}, {{ booking.flight.origin.country }}</div>
                <div class="mt-4">
                  <div class="text-xs text-gray-500 font-medium">Date & Time</div>
                  <div class="text-sm font-semibold text-gray-900">
                    {{ new Date(booking.flight.departureTime).toLocaleDateString() }}
                  </div>
                  <div class="text-xs font-semibold text-gray-900">
                    {{ new Date(booking.flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                  </div>
                </div>
              </div>
              
              <!-- Destination -->
              <div class="bg-green-50 p-5 rounded-xl border border-green-100 transform hover:scale-105 transition-transform duration-200">
                <div class="text-sm text-green-700 font-semibold mb-3">Arrival</div>
                <div class="text-sm font-semibold text-green-900">{{ booking.flight.destination.code }}</div>
                <div class="text-gray-700 font-medium">{{ booking.flight.destination.name }}</div>
                <div class="text-gray-600 text-sm">{{ booking.flight.destination.city }}, {{ booking.flight.destination.country }}</div>
                <div class="mt-4">
                  <div class="text-xs text-gray-500 font-medium">Date & Time</div>
                  <div class="text-sm font-semibold text-gray-900">
                    {{ new Date(booking.flight.arrivalTime).toLocaleDateString() }}
                  </div>
                  <div class="text-xs font-semibold text-gray-900">
                    {{ new Date(booking.flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <svg class="w-6 h-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
                </svg>
                <div>
                  <div class="text-xs text-gray-500 font-medium">Flight Number</div>
                  <div class="font-semibold text-gray-900">{{ booking.flight.flightNumber }}</div>
                </div>
              </div>
              
              <div class="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <svg class="w-6 h-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <div class="text-xs text-gray-500 font-medium">Fare Class</div>
                  <div class="font-semibold text-gray-900 capitalize">{{ booking.fareClass }}</div>
                </div>
              </div>
              
              <div class="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                <svg class="w-6 h-6 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <div>
                  <div class="text-xs text-gray-500 font-medium">Seat(s)</div>
                  <div class="font-semibold text-gray-900">{{ booking.seats.join(', ') || 'Not assigned' }}</div>
                </div>
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
                  <span class="text-gray-600">Email: {{ p.email || 'Not provided' }}</span>
                </div>
                
                <div class="flex items-center text-sm">
                  <svg class="w-4 h-4 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-600">Contact: {{ p.passport || 'Not provided' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ticket Actions Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Your E-Ticket</h2>
          
          <div class="flex flex-col md:flex-row gap-6">
            <!-- QR Code -->
            <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
              <img :src="ticket.barcodeUrl" alt="Ticket QR Code" class="w-48 h-48" />
              <p class="text-sm text-gray-500 mt-3">Scan at airport for boarding</p>
            </div>
            
            <!-- Ticket Actions -->
            <div class="flex flex-col justify-center space-y-4">
              <a 
                v-if="ticket.eTicketPdfUrl" 
                :href="ticket.eTicketPdfUrl" 
                target="_blank" 
                class="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition duration-200"
              >
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Download E-Ticket PDF
              </a>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm text-blue-700">Present this QR code or your downloaded ticket at the airport</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Details Card -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Booking Information</h3>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Booking Date:</span>
                  <span class="font-medium">{{ new Date(booking.createdAt).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Ticket Issued:</span>
                  <span class="font-medium">{{ new Date(ticket.issuedAt).toLocaleString() }}</span>
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
                  <span class="font-medium capitalize">{{ booking.paymentMethod.replace('_', ' ') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Fare:</span>
                  <span class="font-medium text-green-600">${{ booking.fare }}</span>
                </div>
              </div>
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
import { getMyTicket } from '../services/tickets.service';
import { scanTicket } from '../services/tickets.service';

const route = useRoute();
const router = useRouter();
const ticket = ref(null);
const booking = ref(null);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const token = route.query.token;
    const ticketId = route.params.id;

    if (token) {
      // Public scan flow using the signed token
      const res = await scanTicket(token);
      // scan endpoint returns { ticket, booking }
      ticket.value = res.data.ticket || null;
      booking.value = res.data.booking || null;

      // Optionally update the URL to remove token from visible bar (but keep it in history)
      // router.replace({ path: route.path, query: {} }).catch(()=>{});
      loading.value = false;
      return;
    }

    // No token: fallback to authenticated user fetch
    // Call GET /api/tickets/:id (requires authentication)
    if (ticketId) {
      const res = await getMyTicket(ticketId);
      // existing getMyTicket returns { ticket, booking } or ticket in res.data
      // support both shapes:
      if (res.data.ticket) {
        ticket.value = res.data.ticket;
        booking.value = res.data.booking;
      } else {
        ticket.value = res.data.ticket || res.data;
        booking.value = res.data.booking || null;
      }
      loading.value = false;
      return;
    }

    loading.value = false;
  } catch (err) {
    console.error('Failed to load ticket', err);
    loading.value = false;
    // optional: if token invalid, show friendly page / keep token in query for debug
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