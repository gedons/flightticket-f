<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">User Dashboard</h1>
            <p class="text-gray-600 mt-2">Welcome back, <span class="font-semibold text-indigo-600">{{ auth.user?.name }}</span> — quick access to flights, bookings and tickets.</p>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="flex items-center bg-indigo-50 rounded-lg px-4 py-2">
              <svg class="w-5 h-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span class="text-sm text-indigo-700">Quick access to all flight options</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter Section -->
      <section class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
          <h3 class="text-xl font-semibold text-gray-800 mb-3 md:mb-0">Available Flights</h3>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input 
              v-model="q" 
              @input="onQuickSearch" 
              placeholder="Search by code, city or flight number" 
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-80 transition duration-200" 
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-10">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <span class="ml-3 text-gray-600">Loading flights...</span>
        </div>

        <!-- Flights List -->
        <ul v-else class="space-y-4">
          <li v-for="f in visibleFlights" :key="f._id" class="bg-gray-50 hover:bg-indigo-50 p-5 rounded-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="text-xl font-bold text-indigo-700">{{ f.flightNumber }}</div>
                  <div class="mx-3 text-gray-400">→</div>
                  <div class="flex items-center">
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ f.origin.code }}</span>
                    <span class="mx-2 text-gray-500">to</span>
                    <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ f.destination.code }}</span>
                  </div>
                </div>
                
                <div class="text-sm text-gray-600 mb-3">{{ f.origin.name }} → {{ f.destination.name }}</div>
                
                <div class="flex flex-wrap gap-3">
                  <template v-for="fc in f.fareClasses">
                    <div class="bg-white border rounded-lg px-3 py-2 shadow-sm">
                      <div class="text-xs text-gray-500 uppercase">{{ fc.name }}</div>
                      <div class="flex items-baseline">
                        <span class="font-bold text-indigo-700 mr-1">${{ fc.price }}</span>
                        <span class="text-xs text-gray-500">{{ fc.seatsAvailable }} seats</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              
              <div class="mt-4 md:mt-0 md:ml-6">
                <router-link 
                  :to="{ name: 'FlightDetails', params: { id: f._id } }" 
                  class="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 min-w-[120px]"
                >
                  <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  View Details
                </router-link>
              </div>
            </div>
          </li>
        </ul>

        <!-- No Results Message -->
        <div v-if="!loading && flights.length === 0" class="text-center py-10">
          <svg class="w-16 h-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-700">No flights found</h3>
          <p class="mt-2 text-gray-500">Try adjusting your search criteria</p>
        </div>

        <!-- Pagination -->
        <div v-if="flights.length > pageSize" class="mt-6 flex justify-center items-center gap-2">
          <button 
            @click="prevPage" 
            class="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200" 
            :disabled="page === 1"
          >
            <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Previous
          </button>
          
          <span class="px-4 py-2 text-sm text-gray-600">
            Page {{ page }} of {{ totalPages }}
          </span>
          
          <button 
            @click="nextPage" 
            class="px-4 py-2 border border-gray-300 rounded-lg flex items-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200" 
            :disabled="page === totalPages"
          >
            Next
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { searchFlights } from '../services/flights.service';

const auth = useAuthStore();
const flights = ref([]);
const loading = ref(false);
const q = ref('');
const page = ref(1);
const pageSize = ref(10);

const loadFlights = async (query) => {
  loading.value = true;
  try {
    // empty params => fetch all flights (backend returns all)
    const params = query || {};
    const res = await searchFlights(params);
    flights.value = res.data || [];
  } catch (err) {
    console.error('loadFlights error', err);
    flights.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => loadFlights());

const totalPages = computed(() => Math.max(1, Math.ceil(flights.value.length / pageSize.value)));
const visibleFlights = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return flights.value.slice(start, start + pageSize.value);
});

function nextPage() { if (page.value < totalPages.value) page.value++; }
function prevPage() { if (page.value > 1) page.value--; }

function onQuickSearch() {
  // simple client-side filter by code / flightNumber / city
  const term = (q.value || '').trim();
  if (!term) {
    // reload all
    loadFlights();
    return;
  }
  // try backend q param for better results (server side matching)
  loadFlights({ q: term });
}
</script>