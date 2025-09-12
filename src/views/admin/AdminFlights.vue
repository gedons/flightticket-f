<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <header class="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Admin — Flights</h1>
          <p class="text-sm text-slate-500 mt-1">Create, edit and manage flights</p>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div class="relative w-full sm:w-64">
            <input 
              v-model="q" 
              @keyup.enter="load" 
              placeholder="Search flight number / origin / dest" 
              class="pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button @click="openCreate" class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-1 transition-colors w-full sm:w-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              New Flight
            </button>
            <button @click="refresh" class="px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg font-medium flex items-center gap-1 transition-colors w-full sm:w-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div v-if="loading" class="bg-white p-8 rounded-xl shadow-sm text-center">
        <div class="flex flex-col items-center justify-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-slate-600">Loading flights...</p>
        </div>
      </div>

      <div v-else>
        <div v-if="flights.length === 0" class="bg-white p-8 rounded-xl shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          <h3 class="text-lg font-medium text-slate-700 mb-1">No flights found</h3>
          <p class="text-slate-500 mb-4">No flights match your search criteria.</p>
          <button @click="openCreate" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium inline-flex items-center gap-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Flight
          </button>
        </div>

        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li v-for="f in flights" :key="f._id">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all h-full">
              <div class="flex items-start gap-3 mb-4">
                <div v-if="f.airline?.logoUrl" class="flex-shrink-0">
                  <img :src="f.airline.logoUrl" class="w-12 h-12 rounded-lg object-contain border border-slate-200" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-slate-800 truncate">{{ f.flightNumber || '-' }}</h3>
                    <div class="text-sm font-medium text-slate-500">{{ f.airline?.code || '' }}</div>
                  </div>
                  <div class="flex items-center mt-1">
                    <div class="text-sm font-semibold text-slate-700">{{ f.segments?.[0]?.origin?.code || '-' }}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div class="text-sm font-semibold text-slate-700">{{ f.segments?.[0]?.destination?.code || '-' }}</div>
                  </div>
                  <div class="text-xs text-slate-500 mt-1">{{ formatDateShort(f.segments?.[0]?.departureTime) }}</div>
                </div>
              </div>

              <div class="space-y-3 text-sm text-slate-600">
                <div>
                  <div class="font-medium text-slate-700 mb-1">Fare Classes</div>
                  <div class="flex flex-wrap gap-2">
                    <div v-for="fc in f.fareClasses || []" :key="fc.name" class="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {{ fc.name }} ({{ fc.seatsAvailable }})
                    </div>
                    <div v-if="!f.fareClasses || f.fareClasses.length === 0" class="text-slate-400 text-xs">No fare classes</div>
                  </div>
                </div>
                
                <div>
                  <div class="font-medium text-slate-700 mb-1">Amenities</div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="(amenity, index) in (f.amenities || [])" :key="index" class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {{ amenity }}
                    </span>
                    <span v-if="!f.amenities || f.amenities.length === 0" class="text-slate-400 text-xs">No amenities</span>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 mt-5 pt-4 border-t border-slate-100">
                <button @click="onEdit(f)" class="flex-1 px-3 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button @click="confirmDelete(f)" class="flex-1 px-3 py-2 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
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
    </div>

    <!-- modal: create/edit -->
    <transition name="fade">
      <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
              <h2 class="text-xl font-bold text-slate-800">{{ editingMode === 'create' ? 'Create New Flight' : 'Edit Flight' }}</h2>
              <button @click="closeForm" class="text-slate-500 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <AdminFlightForm :initial="selectedFlight" @saved="onSaved" @cancel="closeForm" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminFlightForm from '../../components/AdminFlightForm.vue';
import { adminListFlights, deleteFlight } from '../../services/admin.flights.service';
import { DateTime } from 'luxon';

const loading = ref(false);
const flights = ref([]);
const q = ref('');
const page = ref(1);
const limit = ref(12);

const editing = ref(false);
const editingMode = ref('create'); // 'create' | 'edit'
const selectedFlight = ref(null);

function formatDateShort(iso) {
  if (!iso) return '-';
  try { return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_SHORT); } catch { return iso; }
}

async function load() {
  loading.value = true;
  try {
    const params = { page: page.value, limit, q: q.value || undefined };
    const res = await adminListFlights(params);
    const data = res?.data ?? res ?? [];
    // normalize
    flights.value = Array.isArray(data) ? data : (data.data || data.items || []);
  } catch (err) {
    console.error('adminListFlights failed', err);
  } finally {
    loading.value = false;
  }
}

function refresh() { page.value = 1; load(); }
function prevPage() { if (page.value > 1) { page.value -= 1; load(); } }
function nextPage() { page.value += 1; load(); }

function openCreate() {
  selectedFlight.value = null;
  editingMode.value = 'create';
  editing.value = true;
}
function onEdit(f) {
  selectedFlight.value = JSON.parse(JSON.stringify(f));
  editingMode.value = 'edit';
  editing.value = true;
}
function closeForm() {
  editing.value = false;
  selectedFlight.value = null;
}

async function confirmDelete(f) {
  if (!confirm(`Delete flight ${f.flightNumber}? This action cannot be undone.`)) return;
  try {
    await deleteFlight(f._id);
    alert('Flight deleted successfully');
    load();
  } catch (err) {
    alert(err?.response?.data?.message || err?.message || 'Delete failed');
  }
}

function onSaved() {
  closeForm();
  load();
}

onMounted(load);
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>