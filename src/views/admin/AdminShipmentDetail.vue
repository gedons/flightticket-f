<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-slate-800">
                {{ shipment?.trackingCode || 'Loading...' }}
              </h2>
              <p class="text-slate-600">Shipment tracking & location management</p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="openPrint" 
              class="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              Print Label
            </button>
            <router-link 
              to="/admin/shipments" 
              class="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Shipments
            </router-link>
          </div>
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
          <span class="text-lg">Loading shipment details...</span>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="!loading && shipment" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Map Section -->
        <div class="lg:col-span-2">
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <h3 class="text-xl font-bold flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                Shipment Route & Tracking
              </h3>
              <p class="text-indigo-100 mt-1">Real-time location tracking and route visualization</p>
            </div>
            <div class="p-6">
              <div ref="mapEl" class="w-full h-96 rounded-xl overflow-hidden shadow-lg border border-slate-200"></div>
            </div>
          </div>
        </div>

        <!-- Control Panel -->
        <div class="space-y-6">
          <!-- Status Update -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white rounded-t-2xl">
              <h4 class="font-semibold flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Status Control
              </h4>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">Current Status</label>
                  <select 
                    v-model="status" 
                    class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="pending">📦 Pending</option>
                    <option value="in_transit">🚚 In Transit</option>
                    <option value="out_for_delivery">🚛 Out for Delivery</option>
                    <option value="delivered">✅ Delivered</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </select>
                </div>
                <button 
                  @click="updateStatus" 
                  class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>

          <!-- Add Location -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white rounded-t-2xl">
              <h4 class="font-semibold flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Location
              </h4>
            </div>
            <div class="p-4">
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Latitude</label>
                    <input 
                      v-model.number="loc.lat" 
                      type="number" 
                      step="any" 
                      placeholder="0.0000"
                      class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Longitude</label>
                    <input 
                      v-model.number="loc.lng" 
                      type="number" 
                      step="any" 
                      placeholder="0.0000"
                      class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Location Note</label>
                  <input 
                    v-model="loc.note" 
                    placeholder="e.g. At distribution hub"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Expected Arrival</label>
                  <input 
                    v-model="loc.etaArrival" 
                    type="datetime-local"
                    class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div class="flex gap-2">
                  <button 
                    @click="addLocation" 
                    class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add
                  </button>
                  <button 
                    @click="useCurrentLocation" 
                    class="px-4 py-3 border-2 border-blue-300 hover:border-blue-400 text-blue-700 hover:text-blue-800 rounded-xl transition-all duration-200 flex items-center justify-center"
                    title="Use my current location"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Locations -->
          <div class="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white rounded-t-2xl">
              <h4 class="font-semibold flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Location History
              </h4>
            </div>
            <div class="p-4">
              <div v-if="!shipment.locations || shipment.locations.length === 0" class="text-center py-6">
                <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p class="text-slate-500 text-sm">No locations recorded yet</p>
              </div>

              <div v-else class="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                <div 
                  v-for="(location, index) in shipment.locations" 
                  :key="index" 
                  class="relative flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <!-- Timeline dot -->
                  <div class="flex-shrink-0 relative pt-1">
                    <div 
                      class="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      :class="index === 0 ? 'bg-green-500' : 'bg-purple-500'"
                    ></div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <p class="font-medium text-slate-800 text-sm">{{ location.note || 'Location update' }}</p>
                        <p class="text-xs text-slate-500 mt-1">{{ formatDate(location.recordedAt) }}</p>
                        <div v-if="displayCoords(location)" class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {{ displayCoords(location) }}
                        </div>
                        <div v-if="location.etaArrival" class="text-xs text-purple-600 mt-1 font-medium">
                          ETA: {{ formatDate(location.etaArrival) }}
                        </div>
                      </div>
                      <div v-if="index === 0" class="flex-shrink-0 ml-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
    </div>

    <!-- Toast Notification -->
    <transition name="slide-up">
      <div v-if="toast" class="fixed bottom-6 right-6 bg-gradient-to-r from-sky-600 to-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import { getShipmentAdmin, addShipmentLocation, updateShipment, subscribeToShipmentStream } from '../../services/shipments.service';
import { useRoute } from 'vue-router';
const route = useRoute();

const shipment = ref(null);
const loading = ref(false);
const toast = ref('');
const mapEl = ref(null);
let map = null;
let poly = null;
let marker = null;
let es = null;

const loc = ref({ lat: null, lng: null, note: '', etaArrival: '' });
const status = ref('');

function formatDate(iso) { if (!iso) return '-'; try { return new Date(iso).toLocaleString() } catch { return iso; } }
function displayCoords(l) { return l?.coords?.coordinates ? `${l.coords.coordinates[1].toFixed(5)}, ${l.coords.coordinates[0].toFixed(5)}` : ''; }

async function load() {
  loading.value = true;
  try {
    const res = await getShipmentAdmin(route.params.id);
    const data = res?.data?.shipment ?? res?.data ?? res;
    shipment.value = data;
    status.value = data.status || 'pending';
    initMapIfNeeded();
  } catch (err) {
    console.error(err);
    alert('Failed to load shipment');
  } finally { loading.value = false; }
}

function initMapIfNeeded() {
  if (map) return;
  if (!mapEl.value) {
    console.warn('mapEl not ready yet');
    return;
  }
  try {
    map = L.map(mapEl.value).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  } catch (err) {
    console.error('Failed to init map', err);
    map = null;
  }
}

function drawLocations() {
  // Ensure map exists
  if (!map) {
    initMapIfNeeded();
    if (!map) {
      console.warn('drawLocations: map not initialized, skipping draw');
      return;
    }
  }

  // Remove existing layers safely
  try {
    if (poly) { poly.remove(); poly = null; }
    if (marker) { marker.remove(); marker = null; }
  } catch (err) {
    console.warn('Error removing previous layers', err);
  }

  // compute coords (oldest -> newest)
  const locs = (shipment.value?.locations || []).slice().reverse();
  const coords = locs
    .map(p => (p && p.coords && Array.isArray(p.coords.coordinates)) ? [p.coords.coordinates[1], p.coords.coordinates[0]] : null)
    .filter(Boolean);

  if (!coords.length) {
    // nothing to draw; reset view
    try {
      map.setView([20, 0], 2);
    } catch (e) { /* ignore */ }
    return;
  }

  try {
    poly = L.polyline(coords, { color: '#3b82f6', weight: 4 }).addTo(map);
    // add marker for last point (newest)
    const last = coords[coords.length - 1];
    marker = L.marker(last).addTo(map);
    // fit bounds if poly has bounds
    if (poly && poly.getBounds) {
      map.fitBounds(poly.getBounds(), { padding: [30, 30] });
    } else {
      map.setView(last, 10);
    }
  } catch (err) {
    console.error('Error drawing poly/marker', err);
  }
}

async function addLocation() {
  if (!loc.value.lat || !loc.value.lng) { 
    alert('Please provide both latitude and longitude'); 
    return; 
  }

  // ensure map is ready before calling backend (so drawLocations won't race)
  initMapIfNeeded();

  try {
    const payload = {
      lat: loc.value.lat,
      lng: loc.value.lng,
      note: loc.value.note,
      etaArrival: loc.value.etaArrival,
      status: status.value
    };

    const res = await addShipmentLocation(route.params.id, payload);
    const updated = res?.data?.shipment ?? res?.data ?? res;

    // update local model defensively
    if (updated) {
      // assign the updated object
      shipment.value = updated;
      // ensure locations array exists
      if (!Array.isArray(shipment.value.locations)) shipment.value.locations = [];
    }

    // clear form
    loc.value = { lat: null, lng: null, note: '', etaArrival: '' };

    // ensure map ready and redraw
    initMapIfNeeded();
    drawLocations();

    showToast('Location added successfully');
  } catch (err) {
    console.error('Add location failed', err);
    alert(err?.response?.data?.message || err?.message || 'Add location failed');
  }
}

async function updateStatus() {
  try {
    const res = await updateShipment(route.params.id, { status: status.value });
    shipment.value = res?.data?.shipment ?? res?.data ?? res;
    showToast('Status updated successfully');
  } catch (err) { 
    console.error(err); 
    alert('Status update failed'); 
  }
}

function useCurrentLocation() {
  if (!navigator.geolocation) { 
    alert('Geolocation is not supported by this browser'); 
    return; 
  }
  navigator.geolocation.getCurrentPosition((p) => {
    loc.value.lat = p.coords.latitude;
    loc.value.lng = p.coords.longitude;
    showToast('Current location captured');
  }, (err) => {
    alert('Could not get location: ' + err.message);
  });
}

function showToast(msg) {
  toast.value = msg;
  setTimeout(() => toast.value = '', 4000);
}

function openPrint() {
  const API_BASE = import.meta.env.VITE_API_BASE || '';
  window.open(`${API_BASE}/api/shipments/${route.params.id}/print`, '_blank');
}

onMounted(async () => {
  await load(); // load sets shipment.value and then we init/draw
  initMapIfNeeded();
  drawLocations();

  // subscribe to SSE only after shipment and trackingCode exist
  if (shipment.value?.trackingCode) {
    es = subscribeToShipmentStream(shipment.value.trackingCode);
    es.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        if (payload.type === 'location.updated') {
          // prepend newest
          shipment.value.locations = [payload.payload.location, ...(shipment.value.locations || [])];
          shipment.value.currentLocationText = payload.payload.location.note || shipment.value.currentLocationText;
          shipment.value.lastSeenAt = payload.payload.lastSeenAt || shipment.value.lastSeenAt;
          status.value = payload.payload.status || status.value;
          // draw (map already initialized)
          initMapIfNeeded();
          drawLocations();
          showToast('Location updated (live)');
        }
      } catch (err) {
        console.warn('SSE onmessage parse error', err);
      }
    };
  }
});

onBeforeUnmount(() => {
  if (es) try { es.close(); } catch {}
  if (map) try { map.remove(); } catch {}
});
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

/* Custom scrollbar styling */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) rgb(241 245 249);
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgb(241 245 249);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(203 213 225);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(148 163 184);
}
</style>