<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Find Your Flight</h1>
        <p class="text-gray-600">Search for available flights and book your next journey</p>
      </div>

      <!-- Search Form -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <form @submit.prevent="onSearch" class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="relative">
            <label for="origin" class="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                v-model="form.origin" 
                id="origin"
                placeholder="e.g. LAX" 
                class="pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition duration-200 uppercase" 
              />
            </div>
          </div>
          
          <div class="relative">
            <label for="destination" class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                v-model="form.destination" 
                id="destination"
                placeholder="e.g. JFK" 
                class="pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition duration-200 uppercase" 
              />
            </div>
          </div>
          
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              v-model="form.date" 
              id="date"
              type="date" 
              class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition duration-200" 
            />
          </div>
          
          <div>
            <label for="passengers" class="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <input 
                v-model.number="form.passengers" 
                id="passengers"
                type="number" 
                min="1" 
                class="pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition duration-200" 
              />
            </div>
          </div>
          
          <div class="flex items-end">
            <button 
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full flex items-center justify-center"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
              {{ loading ? 'Searching...' : 'Search Flights' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Results Section -->
      <div v-if="loading" class="flex justify-center items-center py-10 bg-white rounded-xl shadow-md">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Searching for flights...</p>
        </div>
      </div>

      <div v-else-if="flights.length === 0 && formSubmitted" class="bg-white rounded-xl shadow-md p-8 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-700">No flights found</h3>
        <p class="mt-2 text-gray-500">Try adjusting your search criteria</p>
      </div>

      <ul v-else-if="flights.length > 0" class="space-y-4">
        <li v-for="f in flights" :key="f._id" class="bg-white hover:bg-indigo-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center">
            <div class="flex-1">
              <div class="flex items-center mb-3">
                <div class="text-xl font-bold text-indigo-700">{{ f.flightNumber }}</div>
                <div class="mx-3 text-gray-400">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
                  </svg>
                </div>
                <div class="flex items-center">
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ f.origin.code }}</span>
                  <span class="mx-2 text-gray-500">to</span>
                  <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">{{ f.destination.code }}</span>
                </div>
              </div>
              
              <div class="text-sm text-gray-600 mb-4">{{ f.origin.name }} → {{ f.destination.name }}</div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium">Departure: {{ new Date(f.departureTime).toLocaleString() }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium">Arrival: {{ new Date(f.arrivalTime).toLocaleString() }}</span>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-3">
                <template v-for="fc in f.fareClasses">
                  <div class="bg-gray-50 border rounded-lg px-3 py-2 shadow-sm">
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
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { searchFlights } from '../services/flights.service';

const form = reactive({ origin: '', destination: '', date: '', passengers: 1 });
const flights = ref([]);
const loading = ref(false);
const formSubmitted = ref(false);

async function onSearch() {
  loading.value = true;
  formSubmitted.value = true;
  flights.value = [];
  try {
    // normalize IATA codes to trimmed uppercase
    const originParam = form.origin ? String(form.origin).trim().toUpperCase() : undefined;
    const destParam = form.destination ? String(form.destination).trim().toUpperCase() : undefined;

    const params = {
      origin: originParam || undefined,
      destination: destParam || undefined,
      date: form.date || undefined,
      passengers: form.passengers || undefined
    };
    const res = await searchFlights(params);
    flights.value = res.data || [];
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || err.message || 'Search failed');
  } finally {
    loading.value = false;
  }
}
</script>