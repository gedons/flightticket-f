<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
            </div>
            <div>
              <h2 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tickets Management
              </h2>
              <p class="text-gray-600 mt-1">Manage and view all ticket information</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <input 
                v-model="q" 
                placeholder="Search PNR or booking ID..." 
                class="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md w-full sm:w-80"
              />
              <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <button 
              @click="load" 
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          <div class="flex items-center gap-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="text-lg font-medium text-gray-700">Loading tickets...</span>
          </div>
        </div>
      </div>

      <!-- Tickets Grid -->
      <div v-else-if="tickets.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="ticket in tickets" 
          :key="ticket._id"
          class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group"
        >
          <!-- Ticket Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <div class="font-bold text-gray-800 text-lg">{{ ticket.bookingId }}</div>
                <div class="text-sm text-gray-500">Booking Reference</div>
              </div>
            </div>
            
            <span class="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
              ISSUED
            </span>
          </div>

          <!-- Ticket Details -->
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 012 0v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0V9H4a1 1 0 110-2h4z"/>
              </svg>
              <span class="text-gray-600">
                <strong>Issued:</strong> 
                {{ ticket.issuedAt ? new Date(ticket.issuedAt).toLocaleString() : 'Not available' }}
              </span>
            </div>
            
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span class="text-gray-600">
                <strong>E-Ticket:</strong>
                <a 
                  v-if="ticket.eTicketPdfUrl"
                  :href="ticket.eTicketPdfUrl" 
                  target="_blank" 
                  class="text-blue-600 hover:text-purple-600 font-medium hover:underline ml-1"
                >
                  Download PDF
                </a>
                <span v-else class="text-gray-400 ml-1">Not available</span>
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button 
              @click="view(ticket._id)" 
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              View
            </button>
            <button 
              @click="remove(ticket._id)" 
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
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">No Tickets Found</h3>
          <p class="text-gray-600 mb-6">There are no tickets to display at the moment.</p>
          <button 
            @click="load" 
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Modal for viewing ticket -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800">Ticket Details</h3>
                <p class="text-sm text-gray-600">Booking: {{ modalTicket?.bookingId || 'N/A' }}</p>
              </div>
            </div>
            <button 
              @click="closeModal" 
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
            >
              <svg class="w-6 h-6 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-auto max-h-[calc(90vh-140px)]">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Left Column - Ticket Info & QR Code -->
              <div class="space-y-6">
                <!-- Ticket Information -->
                <div class="bg-gray-50 rounded-xl p-6">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Ticket Information
                  </h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-gray-600 font-medium">Issue Date:</span>
                      <span class="text-gray-800 font-semibold">
                        {{ modalTicket?.issuedAt ? new Date(modalTicket.issuedAt).toLocaleString() : 'Not available' }}
                      </span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-600 font-medium">Status:</span>
                      <span class="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                <!-- QR Code Section -->
                <div class="bg-gray-50 rounded-xl p-6 text-center">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                    </svg>
                    Boarding Pass QR Code
                  </h4>
                  <div v-if="modalTicket?.barcodeUrl" class="inline-block bg-white p-4 rounded-lg shadow-sm">
                    <img 
                      :src="modalTicket.barcodeUrl" 
                      alt="Boarding Pass QR Code" 
                      class="w-48 h-48 mx-auto border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                  <div v-else class="bg-gray-200 rounded-lg p-8">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-gray-500 text-sm">QR Code not available</p>
                  </div>
                </div>
              </div>

              <!-- Right Column - PDF Viewer -->
              <div class="space-y-6">
                <div class="bg-gray-50 rounded-xl p-6">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    E-Ticket PDF
                  </h4>
                  
                  <div v-if="modalTicket?.eTicketPdfUrl" class="bg-white rounded-lg overflow-hidden shadow-sm border">
                    <div class="flex items-center justify-between p-3 bg-gray-100 border-b">
                      <span class="text-sm font-medium text-gray-700">E-Ticket Document</span>
                      <a 
                        :href="modalTicket.eTicketPdfUrl" 
                        target="_blank"
                        class="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Download
                      </a>
                    </div>
                    <iframe 
                      :src="modalTicket.eTicketPdfUrl" 
                      class="w-full h-[60vh] border-0" 
                      frameborder="0"
                    ></iframe>
                  </div>
                  
                  <div v-else class="bg-gray-200 rounded-lg p-12 text-center">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <h5 class="text-lg font-medium text-gray-700 mb-2">PDF Not Available</h5>
                    <p class="text-gray-500 text-sm">The e-ticket PDF document is not available for this ticket.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listTicketsAdmin, getTicketAdmin, deleteTicketAdmin } from '../../services/admin.tickets.service';

const tickets = ref([]);
const loading = ref(false);
const q = ref('');

// modal
const showModal = ref(false);
const modalTicket = ref(null);

async function load() {
  loading.value = true;
  try {
    const res = await listTicketsAdmin({ q: q.value || undefined });
    tickets.value = res.data || [];
  } catch (err) {
    tickets.value = [];
  } finally {
    loading.value = false;
  }
}

async function view(id) {
  try {
    const res = await getTicketAdmin(id);
    // backend returns { ticket, booking } per controller earlier — adapt if necessary
    modalTicket.value = res.data.ticket || res.data;
    showModal.value = true;
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || err.message || 'Failed to load ticket');
  }
}

async function remove(id) {
  if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) return;
  try {
    await deleteTicketAdmin(id);
    alert('Ticket deleted successfully');
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

function closeModal() {
  showModal.value = false;
  modalTicket.value = null;
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

/* Enhanced animations */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}
</style>