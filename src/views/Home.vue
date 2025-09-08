<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
        <div class="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" style="animation-delay: 4s;"></div>
      </div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
            Your Journey
            <br>
            <span class="relative">
              Begins Here
              <svg class="absolute -bottom-2 left-0 w-full h-3 text-yellow-400 opacity-80" viewBox="0 0 300 12" fill="currentColor">
                <path d="M0,6 Q75,0 150,6 T300,6" stroke="currentColor" stroke-width="3" fill="none"/>
              </svg>
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover amazing destinations, book flights in seconds, and create memories that last a lifetime with our seamless booking experience.
          </p>
        </div>
      </div>
    </div>

    <!-- Search Form -->
    <div class="relative z-20 -mt-16 max-w-6xl mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-lg border border-white/20">
        <div class="flex flex-wrap gap-4 mb-6">
          <button 
            @click="tripType = 'roundtrip'"
            :class="['px-4 py-2 rounded-full transition-all duration-200', tripType === 'roundtrip' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Round trip
          </button>
          <button 
            @click="tripType = 'oneway'"
            :class="['px-4 py-2 rounded-full transition-all duration-200', tripType === 'oneway' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            One way
          </button>
          <button 
            @click="tripType = 'multicity'"
            :class="['px-4 py-2 rounded-full transition-all duration-200', tripType === 'multicity' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
          >
            Multi-city
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="lg:col-span-2 grid grid-cols-2 gap-4">
            <div class="relative group">
              <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="searchForm.from"
                  placeholder="Departure city"
                  class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md"
                >
                <svg class="absolute right-3 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
            
            <div class="relative group">
              <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="searchForm.to"
                  placeholder="Destination city"
                  class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md"
                >
                <svg class="absolute right-3 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="relative group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Departure</label>
            <input 
              type="date" 
              v-model="searchForm.departure"
              class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md"
            >
          </div>
          
          <div v-show="tripType === 'roundtrip'" class="relative group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Return</label>
            <input 
              type="date" 
              v-model="searchForm.return"
              class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md"
            >
          </div>
          
          <div class="relative group">
            <label class="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
            <select 
              v-model="searchForm.passengers"
              class="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:shadow-md appearance-none bg-white"
            >
              <option value="1">1 Passenger</option>
              <option value="2">2 Passengers</option>
              <option value="3">3 Passengers</option>
              <option value="4">4+ Passengers</option>
            </select>
          </div>
        </div>
        
        <div class="mt-8 text-center">
          <button 
            @click="searchFlights"
            class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Search Flights
          </button>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Why Choose SkyWings?</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of travel booking with our innovative features and unmatched service.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Lightning Fast</h3>
          <p class="text-gray-600 leading-relaxed">Find and book flights in under 60 seconds with our streamlined search and booking process.</p>
        </div>
        
        <div class="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Best Prices</h3>
          <p class="text-gray-600 leading-relaxed">Compare prices from hundreds of airlines and get the best deals with our price guarantee.</p>
        </div>
        
        <div class="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">Secure & Safe</h3>
          <p class="text-gray-600 leading-relaxed">Your data is protected with bank-level security and SSL encryption for peace of mind.</p>
        </div>
      </div>
    </div>

    <!-- Popular Destinations -->
    <div class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-800 mb-4">Popular Destinations</h2>
          <p class="text-xl text-gray-600">Discover the world's most amazing places</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="destination in popularDestinations" :key="destination.city" 
               class="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div class="aspect-w-16 aspect-h-12 bg-gradient-to-br" :class="destination.gradient">
              <div class="p-6 flex flex-col justify-end text-white relative z-10">
                <div class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                <div class="relative z-20">
                  <h3 class="text-2xl font-bold mb-2">{{ destination.city }}</h3>
                  <p class="text-lg opacity-90">{{ destination.country }}</p>
                  <div class="mt-3 text-sm opacity-75">From {{ destination.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center space-x-2 mb-6">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                </svg>
              </div>
              <span class="text-xl font-bold">SkyWings</span>
            </div>
            <p class="text-gray-400 leading-relaxed">Your trusted partner for seamless travel experiences around the world.</p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Company</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Press</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Support</h4>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Refund Policy</a></li>
              <li><a href="#" class="text-gray-400 hover:text-white transition-colors duration-200">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">Connect</h4>
            <div class="flex space-x-4">
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.223.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.598 2.31-.744 2.869-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-12 pt-8 text-center">
          <p class="text-gray-400">&copy; 2025 SkyWings. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      mobileMenuOpen: false,
      tripType: 'roundtrip',
      searchForm: {
        from: '',
        to: '',
        departure: '',
        return: '',
        passengers: '1'
      },
      popularDestinations: [
        {
          city: 'Paris',
          country: 'France',
          price: '$599',
          gradient: 'from-pink-400 to-red-400'
        },
        {
          city: 'Tokyo',
          country: 'Japan',
          price: '$899',
          gradient: 'from-purple-400 to-indigo-400'
        },
        {
          city: 'New York',
          country: 'USA',
          price: '$449',
          gradient: 'from-blue-400 to-cyan-400'
        },
        {
          city: 'London',
          country: 'UK',
          price: '$529',
          gradient: 'from-green-400 to-blue-400'
        }
      ]
    }
  },
  methods: {
    searchFlights() {
      // Handle flight search logic here
      console.log('Searching flights...', this.searchForm);
      // You can emit an event or navigate to search results
      this.$emit('search-flights', this.searchForm);
    }
  },
  mounted() {
    // Set default departure date to today
    const today = new Date();
    this.searchForm.departure = today.toISOString().split('T')[0];
    
    // Set default return date to 7 days from today
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.searchForm.return = nextWeek.toISOString().split('T')[0];
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.aspect-w-16 {
  position: relative;
  width: 100%;
  height: 200px;
}

.aspect-h-12 {
  padding-bottom: 75%;
}
</style>