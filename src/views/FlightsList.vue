<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Search Flights</h1>
          <p class="text-sm text-slate-500 mt-1">Find and book flights quickly and easily</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <input 
              v-model="q" 
              @keyup.enter="search" 
              placeholder="Search flight number, origin, destination" 
              class="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="relative">
            <input 
              type="date" 
              v-model="date" 
              class="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <button 
            @click="search" 
            class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>
      </header>

      <main>
        <div v-if="loading" class="bg-white p-8 rounded-xl shadow-sm text-center">
          <div class="flex flex-col items-center justify-center">
            <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-slate-600">Searching for flights...</p>
          </div>
        </div>

        <div v-else>
          <div v-if="flights.length === 0" class="bg-white p-8 rounded-xl shadow-sm text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <h3 class="text-lg font-medium text-slate-700 mb-1">No flights found</h3>
            <p class="text-slate-500 mb-4">Try adjusting your search criteria</p>
            <button 
              @click="resetSearch" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium inline-flex items-center gap-1 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Search
            </button>
          </div>

          <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <li v-for="f in flights" :key="f._id">
              <FlightCard :flight="f" @booked="onBooked" />
            </li>
          </ul>

          <div v-if="flights.length > 0" class="mt-8 flex justify-center gap-2">
            <button 
              v-if="page > 1" 
              @click="prevPage" 
              class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button 
              v-if="flights.length === limit" 
              @click="nextPage" 
              class="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-900 text-sm font-medium transition-colors flex items-center gap-1"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listFlights } from '../services/flights.service';
import FlightCard from '../components/FlightCard.vue';
import { publicLookupBookingByPnr } from '../services/bookings.service';

const q = ref('');
const date = ref('');
const flights = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(12); // Increased to match grid layout

async function load() {
  loading.value = true;
  try {
    const params = { page: page.value, limit: limit.value };
    if (q.value) params.q = q.value;
    if (date.value) params.date = date.value;
    const res = await listFlights(params);
    // normalize
    const data = res.data ?? res;
    flights.value = Array.isArray(data) ? data : (data.data || data.items || []);
  } catch (err) {
    console.error('listFlights', err);
  } finally {
    loading.value = false;
  }
}

function search() {
  page.value = 1;
  load();
}

function resetSearch() {
  q.value = '';
  date.value = '';
  page.value = 1;
  load();
}

function prevPage() { if (page.value > 1) { page.value -= 1; load(); } }
function nextPage() { page.value += 1; load(); }

async function onBooked(res) {
  // on successful booking, you likely want to:
  // - show a toast
  // - navigate to /bookings or /tickets
  console.log('Booked', res);
  // reload flights (to update seat availability)
  await load();
}

onMounted(load);
</script>