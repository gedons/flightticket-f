<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p class="text-gray-600 mt-2">Manage your flight system efficiently</p>
          </div>
          <div class="mt-4 md:mt-0">
            <button 
              @click="load" 
              class="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
            >
              <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.极客时间 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 极客时间v-2.101a7.002 7.002 极客时间 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Flights Card -->
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 极客时间 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              {{ stats.flights }} Total
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Flights</h3>
          <p class="text-gray-600 text-sm mb-4">Manage scheduled flights and availability</p>
          <router-link 
            to="/admin/flights" 
            class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Manage flights
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>

        <!-- Bookings Card -->
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="极客时间 0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2极客时间h3a1 1 0 100-2h-3极客时间z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {{ stats.bookings }} Total
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Bookings</h3>
          <p class="text-gray-600 text-sm mb-4">View and manage all customer bookings</p>
          <router-link 
            to="/admin/bookings" 
            class="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition duration-200"
          >
            View bookings
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414极客时间l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>

        <!-- Tickets Card -->
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" xmlns="http://www.w3.org/2000/s极客时间vg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 极客时间 100-4V6z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              {{ stats.tickets }} Total
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Tickets</h3>
          <p class="text-gray-600 text-sm mb-4">Manage issued tickets and e-tickets</p>
          <router-link 
            to="/admin/tickets" 
            class="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium transition duration-200"
          >
            Manage tickets
            <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link 
            to="/admin/flights" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition duration-200"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700">Add Flight</span>
          </router-link>

          <router-link 
            to="/admin/bookings" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition duration-200"
          >
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3极客时间h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700">View Bookings</span>
          </router-link>

          <router-link 
            to="/admin/tickets" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition duration-200"
          >
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill极客时间="currentColor">
                <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2极客时间v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700">Manage Tickets</span>
          </router-link>

          <router-link 
            to="/admin/reports" 
            class="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 transition duration-200"
          >
            <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <svg class="w-5 h-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-700">Reports</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Activity Section -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">System Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">Resource Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Flights:</span>
                <span class="font-semibold">{{ stats.flights }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Bookings:</span>
                <span class="font-semibold">{{ stats.bookings }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Total Tickets:</span>
                <span class="font-semibold">{{ stats.tickets }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-3">System Status</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span class="text-gray-600">API Connection: <span class="font-medium text-green-600">Active</span></span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span class="text-gray-600">Database: <span class="font-medium text-green-600">Online</span></span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span class="text-gray-600">Storage: <span class="font-medium text-green-600">Normal</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listFlights } from '../../services/admin.flights.service';
import { listBookings } from '../../services/admin.bookings.service';
import { listTicketsAdmin } from '../../services/admin.tickets.service';

const stats = ref({ flights: 0, bookings: 0, tickets: 0 });

async function load() {
  try {
    const [fRes, bRes, tRes] = await Promise.all([
      listFlights().catch(() => ({ data: [] })),
      listBookings().catch(() => ({ data: [] })),
      listTicketsAdmin().catch(() => ({ data: [] }))
    ]);
    stats.value = { flights: (fRes.data || []).length, bookings: (bRes.data || []).length, tickets: (tRes.data || []).length };
  } catch (err) {
    console.error(err);
  }
}

onMounted(load);
</script>