<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Airports Management
              </h2>
              <p class="text-gray-600 mt-1">Manage airport information and locations</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="load"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
            <button 
              @click="showCreate = true" 
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create Airport
            </button>
          </div>
        </div>
      </div>

      <!-- Create Form Section -->
      <div v-if="showCreate" class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Create New Airport
            </h3>
            <button 
              @click="showCreate = false"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <AdminAirportForm @saved="onCreate" @cancel="() => (showCreate = false)" />
        </div>
      </div>

      <!-- Edit Form Section -->
      <div v-if="editing" class="mb-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit Airport: {{ editing.code }}
            </h3>
            <button 
              @click="editing = null"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <AdminAirportForm :model="editing" @saved="onUpdate" @cancel="() => (editing = null)" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div class="flex items-center gap-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="text-lg font-medium text-gray-700">Loading airports...</span>
          </div>
        </div>
      </div>

      <!-- Airports Grid -->
      <div v-else-if="airports.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="airport in airports" 
          :key="airport._id"
          class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
        >
          <!-- Airport Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-sm">{{ airport.code }}</span>
              </div>
              <div>
                <div class="font-bold text-gray-800 text-lg">{{ airport.name }}</div>
                <div class="text-sm text-gray-500">Airport Code: {{ airport.code }}</div>
              </div>
            </div>
            
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
              ACTIVE
            </span>
          </div>

          <!-- Location Info -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-gray-600">
                <strong>Location:</strong> {{ airport.city }}, {{ airport.country }}
              </span>
            </div>
            
            <div v-if="airport.timezone" class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-gray-600">
                <strong>Timezone:</strong> {{ airport.timezone }}
              </span>
            </div>

            <div v-if="airport.lat || airport.lon" class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <span class="text-gray-600 font-mono text-xs">
                <strong>Coordinates:</strong> {{ airport.lat || 'N/A' }}, {{ airport.lon || 'N/A' }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 012 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0V9H4a1 1 0 110-2h4z"/>
              </svg>
              <span class="text-gray-600 text-xs">
                <strong>Added:</strong> {{ new Date(airport.createdAt).toLocaleDateString() }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              @click="onEdit(airport)" 
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit
            </button>
            <button 
              @click="onDelete(airport._id)" 
              class="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">No Airports Found</h3>
          <p class="text-gray-600 mb-6">Get started by creating your first airport.</p>
          <button 
            @click="showCreate = true" 
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Airport
          </button>
        </div>
      </div>

      <!-- Statistics Footer -->
      <div v-if="airports.length > 0" class="mt-8">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-2">
                <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-800">{{ airports.length }}</div>
              <div class="text-sm text-gray-600">Total Airports</div>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-800">
                {{ new Set(airports.map(a => a.country)).size }}
              </div>
              <div class="text-sm text-gray-600">Countries</div>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-800">
                {{ new Set(airports.map(a => a.city)).size }}
              </div>
              <div class="text-sm text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminAirportForm from '../../components/AdminAirportForm.vue';
import { listAirports, createAirport, updateAirport, deleteAirport } from '../../services/admin.airports.service';

const airports = ref([]);
const loading = ref(false);
const showCreate = ref(false);
const editing = ref(null);

async function load() {
  loading.value = true;
  try {
    // listAirports now returns { items, pagination, raw }
    const res = await listAirports();
    airports.value = res.items || [];
    // If you want to display pagination, you can read res.pagination
    // e.g. pagination.value = res.pagination;
  } catch (err) {
    airports.value = [];
    console.error('Failed loading airports', err);
  } finally {
    loading.value = false;
  }
}


async function onCreate(payload) {
  try {
    await createAirport(payload);
    showCreate.value = false;
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

function onEdit(airport) {
  editing.value = { ...airport };
  showCreate.value = false; // Close create form if open
}

async function onUpdate(payload) {
  try {
    if (!editing.value) return;
    await updateAirport(editing.value._id, payload);
    editing.value = null;
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this airport? This action cannot be undone.')) return;
  try {
    await deleteAirport(id);
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

onMounted(load);
</script>

<style scoped>
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Enhanced card animations */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Status badge animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>