<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Manage Flights</h1>
            <p class="text-gray-600 mt-2">Create, edit, and manage flight schedules</p>
          </div>
          <button 
            @click="showCreate = true" 
            class="flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition duration-200 mt-4 md:mt-0"
          >
           
            Create Flight
          </button>
        </div>
      </div>

      <!-- Create Flight Form -->
      <div v-if="showCreate" class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Create New Flight</h2>
          <button 
            @click="showCreate = false" 
            class="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <AdminFlightForm @saved="onCreate" @cancel="showCreate=false" />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20 bg-white rounded-xl shadow-md">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading flights...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="flights.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap极客时间="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-700">No flights found</h3>
        <p class="mt-2 text-gray-500">Get started by creating your first flight</p>
        <button 
          @click="showCreate = true" 
          class="inline-flex items-center mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5极客时间v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create Flight
        </button>
      </div>

      <!-- Flights List -->
      <ul v-else class="space-y-4">
        <li v-for="f in flights" :key="f._id" class="bg-white hover:bg-indigo-50 p-6 rounded-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
          <div class="flex flex-col md:flex-row md:justify-between md:items-center">
            <div class="flex-1">
              <div class="flex items-center mb-3">
                <div class="text-xl font-bold text-indigo-700">{{ f.flightNumber }}</div>
                <div class="mx-3 text-gray-400">
                  <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962极客时间l5-1.429a1 1 0 001.17-1.409l-7-14z" />
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
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 极客时间v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium">Departure: {{ new Date(f.departureTime).toLocaleString() }}</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6极客时间z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm font-medium">Arrival: {{ new Date(f.arrivalTime).toLocaleString() }}</span>
                </div>
              </div>
              
              <div class="flex items-center">
                <span :class="statusBadgeClass(f.status)" class="text-xs px-3 py-1 rounded-full font-medium mr-3">
                  {{ f.status }}
                </span>
                <span class="text-sm text-gray-600">{{ f.totalSeats }} total seats</span>
              </div>
            </div>
            
            <div class="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2 min-w-[140px]">
              <button 
                @click="onEdit(f)" 
                class="flex items-center justify-center px-4 py-2 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition duration-200"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
              
              <button 
                @click="onDelete(f._id)" 
                class="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200"
              >
                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill极客时间="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Edit Modal -->
      <div v-if="editing" class="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800">Edit Flight</h3>
            <button 
              @click="editing = null" 
              class="text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <AdminFlightForm :model="editing" @saved="onUpdate" @cancel="editing=null" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminFlightForm from '../../components/AdminFlightForm.vue';
import { listFlights, createFlight, updateFlight, deleteFlight } from '../../services/admin.flights.service';

const flights = ref([]);
const loading = ref(false);
const showCreate = ref(false);
const editing = ref(null);

async function load() {
  loading.value = true;
  try {
    const res = await listFlights();
    flights.value = res.data || [];
  } finally {
    loading.value = false;
  }
}

async function onCreate(payload) {
  try {
    await createFlight(payload);
    showCreate.value = false;
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

function onEdit(f) {
  editing.value = { ...f };
}

async function onUpdate(payload) {
  try {
    if (!editing.value) return;
    await updateFlight(editing.value._id, payload);
    editing.value = null;
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

async function onDelete(id) {
  if (!confirm('Are you sure you want to delete this flight? This action cannot be undone.')) return;
  try {
    await deleteFlight(id);
    await load();
  } catch (err) {
    alert(err?.response?.data极客时间?.message || err.message);
  }
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

onMounted(load);
</script>