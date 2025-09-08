<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Flight Bookings</h1>
            <p class="text-slate-600">Manage and track all flight reservations</p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                v-model="q" 
                placeholder="Search by PNR or email..." 
                class="pl-10 pr-4 py-3 w-full sm:w-80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                @keyup.enter="load"
              />
            </div>
            <button 
              @click="load" 
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center gap-2"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p class="text-slate-600">Loading bookings...</p>
        </div>
      </div>

      <!-- Bookings Grid -->
      <div v-else-if="bookings.length > 0" class="grid gap-4">
        <div 
          v-for="booking in bookings" 
          :key="booking._id" 
          class="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <!-- Booking Info -->
              <div class="flex-1 space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="font-bold text-lg text-slate-900">{{ booking.pnr || 'No PNR' }}</span>
                  </div>
                  
                  <div class="flex gap-2">
                    <span :class="getStatusBadgeClass(booking.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ booking.status || 'Unknown' }}
                    </span>
                    <span :class="getPaymentBadgeClass(booking.paymentStatus)" class="px-3 py-1 rounded-full text-xs font-medium">
                      {{ booking.paymentStatus || 'Unpaid' }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div class="flex items-center gap-2 text-slate-600">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span><strong>User:</strong> {{ booking.userId || booking.userEmail || 'N/A' }}</span>
                  </div>
                  
                  <div class="flex items-center gap-2 text-slate-600">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    <span><strong>Flight:</strong> {{ booking.flightId?.flightNumber || booking.flightId || 'N/A' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <div class="text-slate-600">
                    <strong>Passengers:</strong> 
                    <span class="ml-1">{{ formatPassengers(booking.passengers) }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap lg:flex-col gap-2 lg:min-w-[160px]">
                <button 
                  @click="viewBooking(booking._id)" 
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  View Details
                </button>
                
                <button 
                  @click="onMarkPaid(booking._id)" 
                  class="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Mark Paid
                </button>
                
                <button 
                  @click="onConfirm(booking._id)" 
                  class="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Confirm
                </button>
                
                <button 
                  @click="onCancel(booking._id)" 
                  class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
          <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">No bookings found</h3>
          <p class="text-slate-600">Try adjusting your search criteria or refresh the page</p>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" @click.stop>
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-white">Booking Details</h3>
                <p class="text-blue-100 text-sm">PNR: {{ selectedBooking?.pnr || 'No PNR' }}</p>
              </div>
              <button 
                @click="closeModal" 
                class="text-blue-100 hover:text-white transition-colors duration-200 p-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div v-if="selectedBooking" class="space-y-6">
              <!-- Status Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-slate-50 rounded-xl p-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-slate-600">Status</p>
                      <p class="font-semibold">{{ selectedBooking.status || 'Unknown' }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-50 rounded-xl p-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-green-100 rounded-lg">
                      <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-slate-600">Payment</p>
                      <p class="font-semibold">{{ selectedBooking.paymentStatus || 'Unpaid' }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-slate-50 rounded-xl p-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-purple-100 rounded-lg">
                      <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-slate-600">Created</p>
                      <p class="font-semibold">{{ formatDate(selectedBooking.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Flight Information -->
              <div class="bg-slate-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Flight Details
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-slate-600">Flight Number</p>
                    <p class="font-medium">{{ selectedBooking.flightId?.flightNumber || selectedBooking.flightId || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-600">Route</p>
                    <p class="font-medium">
                      {{ selectedBooking.flightId?.departure || 'N/A' }} → {{ selectedBooking.flightId?.arrival || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- User Information -->
              <div class="bg-slate-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Customer Information
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-slate-600">User ID</p>
                    <p class="font-medium">{{ selectedBooking.userId || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-600">Email</p>
                    <p class="font-medium">{{ selectedBooking.userEmail || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Passengers -->
              <div class="bg-slate-50 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Passengers ({{ selectedBooking.passengers?.length || 0 }})
                </h4>
                <div class="grid gap-3">
                  <div 
                    v-for="(passenger, index) in selectedBooking.passengers" 
                    :key="index"
                    class="bg-white rounded-lg p-4 border border-slate-200"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-slate-900">{{ passenger.name || 'N/A' }}</p>
                        <p class="text-sm text-slate-600">
                          {{ passenger.email || 'No email' }} • {{ passenger.phone || 'No phone' }}
                        </p>
                      </div>
                      <div class="text-right text-sm text-slate-600">
                        <p>Seat: {{ passenger.seat || 'Not assigned' }}</p>
                        <p>Type: {{ passenger.type || 'Adult' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Raw Data (Collapsible) -->
              <div class="bg-slate-50 rounded-xl p-6">
                <button 
                  @click="showRawData = !showRawData"
                  class="flex items-center justify-between w-full text-left"
                >
                  <h4 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    Raw Data
                  </h4>
                  <svg 
                    :class="{ 'rotate-180': showRawData }" 
                    class="w-5 h-5 text-slate-400 transition-transform duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div v-if="showRawData" class="mt-4">
                  <pre class="bg-slate-900 text-green-400 text-sm p-4 rounded-lg overflow-x-auto">{{ JSON.stringify(selectedBooking, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-slate-50 px-6 py-4 flex flex-wrap gap-3 justify-end border-t border-slate-200">
            <button 
              @click="onMarkPaid(selectedBooking._id)" 
              class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Mark Paid
            </button>
            <button 
              @click="onConfirm(selectedBooking._id)" 
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Confirm Booking
            </button>
            <button 
              @click="onCancel(selectedBooking._id)" 
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Cancel Booking
            </button>
            <button 
              @click="closeModal" 
              class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listBookings, markBookingPaid, confirmBooking, cancelBookingAdmin, getBookingAdmin } from '../../services/admin.bookings.service';

const bookings = ref([]);
const loading = ref(false);
const q = ref('');
const showModal = ref(false);
const selectedBooking = ref(null);
const showRawData = ref(false);

async function load() {
  loading.value = true;
  try {
    const res = await listBookings({ q: q.value || undefined });
    bookings.value = res.data || [];
  } catch (err) {
    console.error(err);
    bookings.value = [];
  } finally {
    loading.value = false;
  }
}

async function viewBooking(id) {
  try {
    const res = await getBookingAdmin(id);
    selectedBooking.value = res.data.booking || res.data;
    showModal.value = true;
    showRawData.value = false;
  } catch (err) { 
    console.error(err);
    alert('Error loading booking details');
  }
}

function closeModal() {
  showModal.value = false;
  selectedBooking.value = null;
}

async function onMarkPaid(id) {
  if (!confirm('Mark booking as paid?')) return;
  try {
    await markBookingPaid(id);
    alert('Marked as paid');
    await load();
    if (showModal.value && selectedBooking.value?._id === id) {
      await viewBooking(id); // Refresh modal data
    }
  } catch (err) { 
    alert(err?.response?.data?.message || err.message); 
  }
}

async function onConfirm(id) {
  if (!confirm('Confirm booking (generate ticket)?')) return;
  try {
    const res = await confirmBooking(id);
    alert('Confirmed: ' + (res.data?.ticket?.barcodeUrl ? 'Ticket generated' : 'Confirmed'));
    await load();
    if (showModal.value && selectedBooking.value?._id === id) {
      await viewBooking(id); // Refresh modal data
    }
  } catch (err) { 
    alert(err?.response?.data?.message || err.message); 
  }
}

async function onCancel(id) {
  if (!confirm('Cancel booking?')) return;
  try {
    await cancelBookingAdmin(id);
    alert('Cancelled');
    await load();
    if (showModal.value && selectedBooking.value?._id === id) {
      closeModal(); // Close modal since booking is cancelled
    }
  } catch (err) { 
    alert(err?.response?.data?.message || err.message); 
  }
}

function getStatusBadgeClass(status) {
  const classes = {
    'confirmed': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'cancelled': 'bg-red-100 text-red-700',
    'completed': 'bg-blue-100 text-blue-700'
  };
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

function getPaymentBadgeClass(paymentStatus) {
  const classes = {
    'paid': 'bg-green-100 text-green-700',
    'unpaid': 'bg-red-100 text-red-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'refunded': 'bg-purple-100 text-purple-700'
  };
  return classes[paymentStatus?.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

function formatPassengers(passengers) {
  if (!passengers || passengers.length === 0) return 'None';
  if (passengers.length <= 2) {
    return passengers.map(p => p.name || 'Unknown').join(', ');
  }
  return `${passengers[0]?.name || 'Unknown'} +${passengers.length - 1} more`;
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

onMounted(load);
</script>
