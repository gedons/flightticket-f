<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 5-8-5"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Track Your Package</h1>
            <p class="text-slate-600 text-sm">Real-time shipment tracking</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-4 pt-8">
      <!-- Search Section -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
        <form @submit.prevent="onLookup" class="flex gap-3">
          <div class="flex-1 relative">
            <input 
              v-model="code" 
              placeholder="Enter tracking code (e.g. AB12C34)" 
              class="w-full px-4 py-3 pl-12 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
            />
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <button 
            type="submit"
            class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
            :disabled="loading"
          >
            <span v-if="!loading">Track</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Tracking...
            </span>
          </button>
        </form>

        <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Shipment Details -->
      <div v-if="shipment" class="space-y-6">
        <!-- Main Info Card -->
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <!-- Header with gradient -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div class="flex items-start justify-between">
              <div>
                <div class="text-blue-100 text-sm uppercase tracking-wide font-medium">Tracking Code</div>
                <div class="text-2xl font-bold">{{ shipment.trackingCode }}</div>
                <div class="text-blue-100 mt-1">{{ shipment.serviceType }}</div>
              </div>
              <div v-if="shipment.qrUrl" class="flex-shrink-0">
                <button 
                  @click="openImage(shipment.qrUrl)"
                  class="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 transition-all duration-200"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <!-- Image and basic info -->
            <div class="flex gap-6 mb-6">
              <div class="flex-shrink-0">
                <div v-if="shipment.image && shipment.image.url" class="w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    :src="shipment.image.url" 
                    alt="shipment" 
                    class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200" 
                    @click="openImage(shipment.image.url)" 
                  />
                </div>
                <div v-else class="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-inner">
                  <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 5-8-5"></path>
                  </svg>
                </div>
              </div>

              <div class="flex-1 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-slate-50 rounded-xl p-4">
                    <div class="text-slate-500 text-sm font-medium mb-1">Shipment Date</div>
                    <div class="font-semibold text-slate-800">{{ formatDate(shipment.shipmentDate) }}</div>
                  </div>
                  <div class="bg-slate-50 rounded-xl p-4">
                    <div class="text-slate-500 text-sm font-medium mb-1">Location Arrival</div>
                    <div class="font-semibold text-slate-800">{{ formatDate(nextArrival) || 'Pending' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shipment Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Consignor -->
              <div class="space-y-3">
                <h3 class="font-semibold text-slate-800 flex items-center gap-2">
                  <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                  From (Consignor)
                </h3>
                <div class="bg-slate-50 rounded-xl p-4">
                  <div class="font-medium text-slate-800">{{ shipment.consignor?.fullName || 'Not specified' }}</div>
                  <div class="text-slate-600 text-sm mt-1">{{ shipment.consignor?.address || 'Address not available' }}</div>
                </div>
              </div>

              <!-- Consignee -->
              <div class="space-y-3">
                <h3 class="font-semibold text-slate-800 flex items-center gap-2">
                  <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  To (Consignee)
                </h3>
                <div class="bg-slate-50 rounded-xl p-4">
                  <div class="font-medium text-slate-800">{{ shipment.consignee?.fullName || 'Not specified' }}</div>
                  <div class="text-slate-600 text-sm mt-1">{{ shipment.consignee?.address || 'Address not available' }}</div>
                </div>
              </div>
            </div>

            <!-- Package Details -->
            <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div class="text-slate-600 text-sm font-medium">Content</div>
                <div class="font-semibold text-slate-800 mt-1">{{ shipment.contentDetails || 'Not specified' }}</div>
              </div>
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div class="text-slate-600 text-sm font-medium">Quantity</div>
                <div class="font-semibold text-slate-800 mt-1">{{ shipment.quantity ?? 'Not specified' }}</div>
              </div>
              <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                <div class="text-slate-600 text-sm font-medium">Receiver</div>
                <div class="font-semibold text-slate-800 mt-1">{{ shipment.receiver || 'Not specified' }}</div>
              </div>
            </div>

            <!-- Current Location -->
            <div class="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div class="text-green-700 text-sm font-medium">Current Location</div>
                  <div class="font-semibold text-green-800">{{ shipment.currentLocationText || 'Location updating...' }}</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex gap-3">
              <button 
                @click="printShipment" 
                class="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                Print Label
              </button>
              <button 
                v-if="shipment.qrUrl" 
                @click="openImage(shipment.qrUrl)" 
                class="px-6 py-2 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                </svg>
                View QR Code
              </button>
            </div>
          </div>
        </div>

        <!-- Location History -->
        <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          <div class="p-6 border-b border-slate-200/50">
            <h3 class="text-xl font-bold text-slate-800 flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              Tracking History
            </h3>
          </div>
          
          <div class="p-6">
            <div v-if="!shipment.locations || shipment.locations.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <p class="text-slate-500">No location history available yet</p>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="(location, index) in shipment.locations" 
                :key="index" 
                class="relative flex gap-4 pb-4"
                :class="{ 'border-b border-slate-200': index < shipment.locations.length - 1 }"
              >
                <!-- Timeline dot -->
                <div class="flex-shrink-0 relative">
                  <div 
                    class="w-4 h-4 rounded-full border-4 border-white shadow-lg"
                    :class="index === 0 ? 'bg-green-500' : 'bg-blue-500'"
                  ></div>
                  <div v-if="index < shipment.locations.length - 1" class="absolute left-1/2 top-4 w-0.5 h-8 bg-slate-200 transform -translate-x-1/2"></div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <p class="font-semibold text-slate-800">{{ location.note || 'Location update' }}</p>
                      <p class="text-slate-600 text-sm mt-1">{{ formatDate(location.recordedAt) }}</p>
                      <div v-if="location.coords?.coordinates" class="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        {{ location.coords.coordinates[1] }}, {{ location.coords.coordinates[0] }}
                      </div>
                      <div v-if="location.etaArrival" class="text-xs text-indigo-600 mt-2 font-medium">
                        ETA: {{ formatDate(location.etaArrival) }}
                      </div>
                    </div>
                    <div v-if="index === 0" class="flex-shrink-0 ml-3">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Latest
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <transition name="fade">
      <div v-if="imageModalUrl" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="relative max-w-4xl w-full">
          <button 
            class="absolute -right-4 -top-4 bg-white hover:bg-slate-100 rounded-full p-2 shadow-lg transition-colors duration-200 z-10" 
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
import { ref,computed,onBeforeUnmount } from 'vue';
import { publicLookupShipmentByCode } from '../services/shipments.service';
import { subscribeToShipmentStream } from '../services/shipments.service';
let es = null;

const code = ref('');
const shipment = ref(null);
const loading = ref(false);
const error = ref(null);
const imageModalUrl = ref(null);

function formatDate(iso) {
  if (!iso) return '-';
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

const nextArrival = computed(() => {
  if (!shipment.value?.locations?.length) return null;
  const locWithEta = shipment.value.locations.find(l => l.etaArrival);
  return locWithEta ? locWithEta.etaArrival : null;
});

async function onLookup() {
  error.value = null;
  shipment.value = null;

    if (es) { es.close(); es = null; }
    if (shipment.value?.trackingCode) {
      es = subscribeToShipmentStream(shipment.value.trackingCode);
      es.onmessage = (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          if (payload.type === 'location.updated') {
            // update UI
            shipment.value.locations = [payload.payload.location, ...(shipment.value.locations || [])];
            shipment.value.currentLocationText = payload.payload.location.note || shipment.value.currentLocationText;
            shipment.value.lastSeenAt = payload.payload.lastSeenAt || shipment.value.lastSeenAt;
            // show small toast
            showToast('Shipment location updated');
            // update map (call buildMap or similar)
            buildMap(shipment.value.locations);
          }
        } catch (err) { console.warn('sse parse', err); }
      };
    }
  
  if (!code.value) { error.value = 'Enter tracking code'; return; }
  loading.value = true;
  try {
    const res = await publicLookupShipmentByCode(code.value.trim());
    const data = res?.data?.shipment ?? res?.data ?? res;
    shipment.value = data || null;

    // normalize locations to oldest->new
    if (shipment.value?.locations && shipment.value.locations.length >= 2) {
      const first = new Date(shipment.value.locations[0].recordedAt);
      const second = new Date(shipment.value.locations[1].recordedAt);
      if (first > second) shipment.value.locations.reverse();
    }
  } catch (err) {
    console.error(err);
    error.value = err?.response?.data?.message || err?.message || 'Lookup failed';
  } finally {
    loading.value = false;
  }
}

function openImage(url) {
  imageModalUrl.value = url;
}

function printShipment() {
  if (!shipment.value) return;
  // prefer DB id if available, otherwise fallback to print-by-code URL
  const API_BASE = import.meta.env.VITE_API_BASE || '';
  const id = shipment.value._id;
  let url = '';
  if (id) {
    url = `${API_BASE}/api/shipments/${encodeURIComponent(id)}/print`;
  } else {
    // fallback - open admin print route by tracking code if you add it; for now open the raw pdf via qr or notify user
    alert('Print not available for this shipment (missing id).');
    return;
  }
  window.open(url, '_blank');
}

onBeforeUnmount(()=> { if (es) es.close(); });
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>