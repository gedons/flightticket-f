<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <div class="flex items-center">
              <svg class="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900">FlightApp</span>
            </div>
          </router-link>
          
          <!-- Primary Navigation (Desktop) -->
          <div class="hidden md:ml-8 md:flex md:items-center md:space-x-4">
            <router-link 
              to="/flights" 
              class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
              active-class="text-indigo-600 bg-indigo-50"
            >
              <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Search Flights
            </router-link>
            
            <!-- Authenticated Links - User -->
            <template v-if="auth.isAuthenticated() && auth.role !== 'admin'">
              <router-link 
                to="/bookings" 
                class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                active-class="text-indigo-600 bg-indigo-50"
              >
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                </svg>
                My Bookings
              </router-link>
              
              <router-link 
                to="/tickets" 
                class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                active-class="text-indigo-600 bg-indigo-50"
              >
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
                My Tickets
              </router-link>
            </template>

            <!-- Admin Only Links -->
            <template v-if="auth.isAuthenticated() && auth.role === 'admin'">
              <router-link 
                to="/admin/flights" 
                class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                active-class="text-indigo-600 bg-indigo-50"
              >
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                </svg>
                Manage Flights
              </router-link>
              
              <router-link 
                to="/admin/bookings" 
                class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                active-class="text-indigo-600 bg-indigo-50"
              >
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                </svg>
                Manage Bookings
              </router-link>
              
              <router-link 
                to="/admin/tickets" 
                class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                active-class="text-indigo-600 bg-indigo-50"
              >
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
                Manage Tickets
              </router-link>
            </template>
          </div>
        </div>

        <!-- Right Navigation -->
        <div class="flex items-center">
          <div class="hidden md:flex items-center space-x-4">
            <!-- Guest -->
            <template v-if="!auth.isAuthenticated()">
              <router-link 
                to="/login" 
                class="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign In
              </router-link>
              <router-link 
                to="/register" 
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 shadow-sm"
              >
                Sign Up
              </router-link>
            </template>

            <!-- Authenticated -->
            <template v-else>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <span class="text-sm text-gray-700 mr-2">Hello, <strong>{{ auth.user?.name ?? 'User' }}</strong></span>
                  
                  <!-- role badge -->
                  <span 
                    v-if="auth.role" 
                    :class="roleBadgeClass(auth.role)" 
                    class="text-xs px-2.5 py-1 rounded-full font-semibold"
                  >
                    {{ auth.role.toUpperCase() }}
                  </span>
                </div>
                
                <button 
                  @click="goDashboard" 
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 shadow-sm flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </button>
                
                <button 
                  @click="logout" 
                  class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </template>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden ml-4">
            <button 
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="text-gray-600 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 p-2 rounded-md"
              :aria-expanded="isMobileMenuOpen"
              aria-label="Main menu"
            >
              <svg v-if="!isMobileMenuOpen" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 pt-2 pb-3 px-2 space-y-1">
      <!-- Guest Mobile Menu -->
      <template v-if="!auth.isAuthenticated()">
        <router-link 
          to="/login" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
          @click="isMobileMenuOpen = false"
        >
          Sign In
        </router-link>
        <router-link 
          to="/register" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
          @click="isMobileMenuOpen = false"
        >
          Sign Up
        </router-link>
      </template>
      
      <!-- Authenticated Mobile Menu -->
      <template v-else>
        <div class="px-3 py-2">
          <div class="text-sm text-gray-500">Logged in as</div>
          <div class="text-sm font-medium text-gray-800">{{ auth.user?.name ?? 'User' }}</div>
          <span 
            v-if="auth.role" 
            :class="roleBadgeClass(auth.role)" 
            class="inline-block mt-1 text-xs px-2 py-1 rounded-full font-semibold"
          >
            {{ auth.role.toUpperCase() }}
          </span>
        </div>
        
        <router-link 
          to="/flights" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
          @click="isMobileMenuOpen = false"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Search Flights
        </router-link>
        
        <!-- User Links -->
        <template v-if="auth.role !== 'admin'">
          <router-link 
            to="/bookings" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            My Bookings
          </router-link>
          
          <router-link 
            to="/tickets" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
            </svg>
            My Tickets
          </router-link>
        </template>
        
        <!-- Admin Links -->
        <template v-if="auth.role === 'admin'">
          <router-link 
            to="/admin/flights" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 极客时间 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.极客时间.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fill-rule="evenodd" d="M10 极客时间a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.极客时间.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 极客时间 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
            </svg>
            Manage Flights
          </router-link>
          
          <router-link 
            to="/admin/bookings" 
            class="block px-极客时间 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9极客时间z" />
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2极客时间h.01a1 1 0 100-2H7zm3 0a1 1 极客时间 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            Manage Bookings
          </router-link>
          
          <router-link 
            to="/admin/tickets" 
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
            @click="isMobileMenuOpen = false"
          >
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
            </svg>
            Manage Tickets
          </router-link>
        </template>
        
        <button 
          @click="goDashboardMobile" 
          class="block w-full text-left px-3 py-2 rounded-md极客时间 text-base font-medium text-gray-600 hover:text-indigo-600 hover:极客时间bg-gray-50 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0极客时间l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Dashboard
        </button>
        
        <button 
          @click="logoutMobile" 
          class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 flex items-center"
        >
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9极客时间H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
          </svg>
          Logout
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';

const auth = useAuthStore();
const router = useRouter();
const isMobileMenuOpen = ref(false);

function logout() {
  auth.logout();
  router.push('/');
}

function logoutMobile() {
  isMobileMenuOpen.value = false;
  logout();
}

function goDashboard() {
  if (auth.role === 'admin') router.push('/admin');
  else router.push('/dashboard');
}

function goDashboardMobile() {
  isMobileMenuOpen.value = false;
  goDashboard();
}

/**
 * Small helper to style role badge.
 * Returns Tailwind classes based on role.
 */
function roleBadgeClass(role) {
  if (role === 'admin') return 'bg-red-100 text-red-800';
  return 'bg-indigo-100 text-indigo-800';
}
</script>