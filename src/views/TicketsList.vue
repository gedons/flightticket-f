<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">My E-Tickets</h1>
            <p class="text-gray-600 mt-2">Access and manage your flight tickets</p>
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
          <p class="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="tickets.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-700">No tickets found</h3>
        <p class="mt-2 text-gray-500">You don't have any tickets yet</p>
        <router-link 
          to="/flights" 
          class="inline-flex items-center mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Book a Flight
        </router-link>
      </div>

      <!-- Tickets List -->
      <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <li v-for="t in tickets" :key="t._id" class="bg-white hover:bg-indigo-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div class="flex flex-col h-full">
            <!-- Ticket Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
                <span class="text-sm font-medium text-gray-500">E-Ticket</span>
              </div>
              <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                Issued
              </span>
            </div>

            <!-- Ticket Details -->
            <div class="flex-1">
              <!-- <div class="mb-4">
                <div class="text-xs text-gray-500 mb-1">PNR Number</div>
                <div class="text-lg font-bold text-gray-800">{{ t.meta?.pnr || '—' }}</div>
              </div> -->

              <div class="mb-4">
                <div class="text-xs text-gray-500 mb-1">Issue Date</div>
                <div class="text-sm text-gray-700">{{ new Date(t.issuedAt).toLocaleDateString() }}</div>
                <div class="text-xs text-gray-500">{{ new Date(t.issuedAt).toLocaleTimeString() }}</div>
              </div>

              <div class="mb-4">
                <div class="text-xs text-gray-500 mb-1">Ticket ID</div>
                <div class="text-sm font-mono text-gray-600 truncate">{{ t._id }}</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
              <router-link 
                :to="{ name: 'TicketView', params: { id: t._id } }" 
                class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex-1"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                View Details
              </router-link>
              
              <a 
                v-if="t.eTicketPdfUrl" 
                :href="t.eTicketPdfUrl" 
                target="_blank" 
                class="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition duration-200 flex-1"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        </li>
      </ul>

      <!-- Additional Help Section -->
      <div v-if="tickets.length > 0" class="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-lg font-medium text-blue-800">Need help with your tickets?</h3>
            <p class="text-blue-700 mt-1">If you have any issues with your e-tickets, please contact our customer support team for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listMyTickets } from '../services/tickets.service';

const tickets = ref([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    const res = await listMyTickets();
    tickets.value = res.data;
  } catch (err) {
    alert(err?.response?.data?.message || err.message || 'Failed to load tickets');
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>