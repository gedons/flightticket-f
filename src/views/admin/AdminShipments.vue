<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 5-8-5"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-slate-800">Shipments</h1>
              <p class="text-slate-600">Manage all shipments and tracking</p>
            </div>
          </div>
          
          <button 
            @click="openCreate" 
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Shipment
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center gap-3 text-slate-600">
          <svg class="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg">Loading shipments...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="shipments.length === 0" class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <div class="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 5-8-5"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-slate-800 mb-2">No shipments yet</h3>
        <p class="text-slate-600 mb-6">Get started by creating your first shipment</p>
        <button 
          @click="openCreate"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Create First Shipment
        </button>
      </div>

      <!-- Shipments Grid -->
      <div v-else class="grid gap-6">
        <div 
          v-for="shipment in shipments" 
          :key="shipment._id" 
          class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-200 group"
        >
          <div class="p-6">
            <div class="flex items-start gap-6">
              <!-- Shipment Image -->
              <div class="flex-shrink-0">
                <div v-if="shipment.image && shipment.image.url" class="w-20 h-20 rounded-xl overflow-hidden shadow-lg">
                  <img
                    :src="shipment.image.url"
                    alt="shipment"
                    class="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                    @click="openImage(shipment.image.url)"
                  />
                </div>
                <div v-else class="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-inner">
                  <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              <!-- Shipment Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="text-lg font-bold text-slate-800 mb-1">
                      {{ shipment.title || 'Untitled Shipment' }}
                    </h3>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        #{{ shipment.trackingCode }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- QR Code Status -->
                  <div class="flex items-center gap-2">
                    <div v-if="shipment.qrUrl" class="flex items-center gap-1 text-green-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                      </svg>
                      <a :href="shipment.qrUrl" target="_blank" class="text-sm font-medium hover:underline">QR Available</a>
                    </div>
                    <div v-else class="flex items-center gap-1 text-slate-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                      </svg>
                      <span class="text-sm">No QR</span>
                    </div>
                  </div>
                </div>

                <!-- Destination -->
                <div class="flex items-center gap-2 text-slate-600 mb-4">
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-sm truncate">{{ shipment.destination?.address || 'Destination not specified' }}</span>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-2">
                  <button 
                    @click="edit(shipment)" 
                    class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  
                  <button 
                    @click="openLocations(shipment)" 
                    class="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Locations
                  </button>
                  
                  <button 
                    @click="openPrint(shipment)" 
                    class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                    Print
                  </button>
                  
                  <button 
                    @click="confirmDelete(shipment)" 
                    class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <transition name="modal-fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-start justify-center pt-12 px-4">
        <div class="bg-black/60 backdrop-blur-sm absolute inset-0" @click="closeForm"></div>
        <div class="relative w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div class="p-6">
            <AdminShipmentForm :initial="editingShipment" @saved="onSaved" @cancel="closeForm" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Image Lightbox -->
    <transition name="fade">
      <div v-if="imageModalUrl" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="relative max-w-4xl w-full">
          <button 
            class="absolute -right-4 -top-4 bg-white hover:bg-slate-100 rounded-full p-3 shadow-lg transition-colors duration-200 z-10" 
            @click="imageModalUrl = null"
          >
            <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <img :src="imageModalUrl" class="w-full h-auto rounded-2xl shadow-2xl" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminShipmentForm from '../../components/AdminShipmentForm.vue';
import { listShipments, deleteShipment } from '../../services/shipments.service';

const router = useRouter();
const shipments = ref([]);
const loading = ref(false);
const showForm = ref(false);
const editingShipment = ref(null);
const imageModalUrl = ref(null);

async function load() {
  loading.value = true;
  try {
    const res = await listShipments({ limit: 100 });
    // Expecting { data: { data: [...], pagination: {...} } }
    const data = res?.data?.data ?? res?.data ?? res;
    shipments.value = Array.isArray(data) ? data : (data || []);
  } catch (err) {
    console.error('listShipments failed', err);
    shipments.value = [];
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingShipment.value = null;
  showForm.value = true;
}

function edit(s) {
  editingShipment.value = s;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
  editingShipment.value = null;
}

async function onSaved() {
  closeForm();
  await load();
}

async function confirmDelete(s) {
  if (!confirm('Are you sure you want to delete this shipment? This action cannot be undone.')) return;
  try {
    await deleteShipment(s._id);
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err?.message || 'Delete failed');
  }
}

function openImage(url) {
  imageModalUrl.value = url;
}

function openLocations(s) {
  router.push({ path: `/admin/shipments/${s._id}` }).catch(()=>{});
}

function openPrint(s) {
  const API_BASE = import.meta.env.VITE_API_BASE || '';
  const url = `${API_BASE}/api/shipments/${encodeURIComponent(s._id)}/print`;
  window.open(url, '_blank');
}

onMounted(load);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>