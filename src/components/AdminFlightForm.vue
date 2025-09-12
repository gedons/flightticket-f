<template>
  <div>
    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Airline Section -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Airline Information
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Airline name</label>
            <input v-model="form.airline.name" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Airline code</label>
            <input v-model="form.airline.code" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
            <input v-model="form.airline.logoUrl" placeholder="https://..." class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            <p class="text-xs text-slate-400 mt-2">Paste Cloudinary URL or image host</p>
          </div>
        </div>
      </div>

      <!-- Flight number & meta -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Flight Details
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Flight number</label>
            <input v-model="form.flightNumber" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Total seats</label>
            <input v-model.number="form.totalSeats" type="number" min="1" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select v-model="form.status" class="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="scheduled">Scheduled</option>
              <option value="cancelled">Cancelled</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Segments -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Flight Segments
          </h3>
          <button type="button" @click="addSegment" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Segment
          </button>
        </div>

        <div v-for="(s, idx) in form.segments" :key="idx" class="p-4 bg-slate-50 rounded-lg mb-4 border border-slate-200">
          <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <div class="font-medium text-slate-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Segment {{ idx + 1 }}
            </div>
            <div class="flex gap-2">
              <button type="button" @click="cloneSegment(idx)" class="px-2 py-1 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded text-sm transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Clone
              </button>
              <button type="button" @click="removeSegment(idx)" class="px-2 py-1 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 rounded text-sm transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Origin code</label>
              <input v-model="s.origin.code" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Destination code</label>
              <input v-model="s.destination.code" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Aircraft</label>
              <input v-model="s.aircraft" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>

          <!-- Enhanced Date/Time Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Departure Date & Time</label>
              <input 
                :value="formatDatetimeLocal(s.departureTime)" 
                @input="updateDepartureTime(idx, $event.target.value)"
                type="datetime-local" 
                class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
              <div class="text-xs text-slate-400 mt-1">
                ISO: {{ s.departureTime || 'Not set' }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Departure timezone</label>
              <select v-model="s.departureTimezone" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="">Select timezone</option>
                <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Arrival Date & Time</label>
              <input 
                :value="formatDatetimeLocal(s.arrivalTime)" 
                @input="updateArrivalTime(idx, $event.target.value)"
                type="datetime-local" 
                class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              />
              <div class="text-xs text-slate-400 mt-1">
                ISO: {{ s.arrivalTime || 'Not set' }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Arrival timezone</label>
              <select v-model="s.arrivalTimezone" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option value="">Select timezone</option>
                <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Departure terminal</label>
              <input v-model="s.terminalOrigin" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Arrival terminal</label>
              <input v-model="s.terminalDestination" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>
        </div>
      </div>

      <!-- Fare classes -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fare Classes
          </h3>
          <button type="button" @click="addFareClass" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Fare Class
          </button>
        </div>

        <div v-for="(fc, i) in form.fareClasses" :key="i" class="p-4 bg-slate-50 rounded-lg mb-3 border border-slate-200">
          <div class="flex items-center justify-between mb-3">
            <div class="font-medium text-slate-700">{{ fc.name || `Fare Class ${i+1}` }}</div>
            <button type="button" @click="removeFareClass(i)" class="px-2 py-1 border border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 rounded text-sm transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Class Name</label>
              <input v-model="fc.name" placeholder="economy" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Price ($)</label>
              <input v-model.number="fc.price" type="number" min="0" placeholder="price" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Seats Available</label>
              <input v-model.number="fc.seatsAvailable" type="number" min="0" placeholder="seats" class="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
            </div>
          </div>
        </div>
      </div>

      <!-- Amenities -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Amenities
        </h3>
        <div class="flex flex-wrap gap-3">
          <label v-for="a in availableAmenities" :key="a" class="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200 has-[:checked]:text-blue-700">
            <input type="checkbox" :value="a" v-model="form.amenities" class="rounded text-blue-600 focus:ring-blue-500" />
            <span class="capitalize text-sm font-medium">{{ amenLabel(a) }}</span>
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">
            Preview: <span class="font-medium text-slate-700">{{ form.flightNumber || '-' }}</span>
          </div>
          <div class="flex gap-2">
            <button type="button" @click="$emit('cancel')" class="px-4 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="submitting" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-1 disabled:opacity-75 disabled:cursor-not-allowed">
              <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ submitting ? 'Saving...' : (isEdit ? 'Update Flight' : 'Create Flight') }}
            </button>
          </div>
        </div>
        
        <div v-if="error" class="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ error }}
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { createFlight, updateFlight } from '../services/admin.flights.service';

const props = defineProps({
  initial: { type: Object, default: null }
});
const emits = defineEmits(['saved', 'cancel']);

const availableAmenities = ['wifi','inseat_power','inflight_entertainment','meals'];

// Common timezones for flight booking
const commonTimezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Eastern (New York)', value: 'America/New_York' },
  { label: 'Central (Chicago)', value: 'America/Chicago' },
  { label: 'Mountain (Denver)', value: 'America/Denver' },
  { label: 'Pacific (Los Angeles)', value: 'America/Los_Angeles' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Paris (CET)', value: 'Europe/Paris' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'Singapore (SGT)', value: 'Asia/Singapore' },
  { label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' }
];

const defaultSegment = () => ({
  segmentIndex: 1,
  origin: { code: '', name: '', city: '' },
  destination: { code: '', name: '', city: '' },
  departureTime: '',
  arrivalTime: '',
  departureTimezone: '',
  arrivalTimezone: '',
  terminalOrigin: '',
  terminalDestination: '',
  gateOrigin: '',
  gateDestination: '',
  aircraft: '',
  cabin: '',
  travelTimeMinutes: null,
  distanceKm: null,
  stops: 0
});

const defaultFare = () => ({ name: 'economy', price: 0, seatsAvailable: 0 });

const isEdit = computed(() => !!props.initial && !!props.initial._id);

const form = ref({
  airline: { name: '', code: '', logoUrl: '' },
  flightNumber: '',
  segments: [ defaultSegment() ],
  fareClasses: [ defaultFare() ],
  amenities: [],
  totalSeats: 0,
  status: 'scheduled',
  metadata: {}
});

const submitting = ref(false);
const error = ref(null);

// Date formatting functions
function formatDatetimeLocal(isoString) {
  if (!isoString) return '';
  try {
    // Convert ISO string to local datetime format for input[type="datetime-local"]
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting datetime-local:', error);
    return '';
  }
}

function convertLocalDatetimeToISO(localDatetime) {
  if (!localDatetime) return '';
  try {
    // Convert local datetime to ISO string
    const date = new Date(localDatetime);
    return date.toISOString();
  } catch (error) {
    console.error('Error converting to ISO:', error);
    return '';
  }
}

function updateDepartureTime(segmentIndex, localDatetime) {
  const isoString = convertLocalDatetimeToISO(localDatetime);
  form.value.segments[segmentIndex].departureTime = isoString;
}

function updateArrivalTime(segmentIndex, localDatetime) {
  const isoString = convertLocalDatetimeToISO(localDatetime);
  form.value.segments[segmentIndex].arrivalTime = isoString;
}

// initialize when editing
if (props.initial) {
  const src = JSON.parse(JSON.stringify(props.initial));
  form.value.airline = src.airline || form.value.airline;
  form.value.flightNumber = src.flightNumber || form.value.flightNumber;
  form.value.segments = (Array.isArray(src.segments) && src.segments.length) ? src.segments : form.value.segments;
  form.value.fareClasses = (Array.isArray(src.fareClasses) && src.fareClasses.length) ? src.fareClasses : form.value.fareClasses;
  form.value.amenities = Array.isArray(src.amenities) ? src.amenities : [];
  form.value.totalSeats = src.totalSeats || form.value.totalSeats;
  form.value.status = src.status || form.value.status;
  form.value.metadata = src.metadata || {};
}

// helpers
function addSegment() {
  const s = defaultSegment();
  s.segmentIndex = (form.value.segments.length + 1);
  form.value.segments.push(s);
}
function cloneSegment(idx) {
  const cp = JSON.parse(JSON.stringify(form.value.segments[idx] || defaultSegment()));
  form.value.segments.splice(idx+1, 0, cp);
}
function removeSegment(idx) {
  if (form.value.segments.length <= 1) { form.value.segments = [ defaultSegment() ]; return; }
  form.value.segments.splice(idx, 1);
}
function addFareClass() { form.value.fareClasses.push(defaultFare()); }
function removeFareClass(i) { form.value.fareClasses.splice(i,1); if (form.value.fareClasses.length === 0) form.value.fareClasses.push(defaultFare()); }

function amenLabel(a) {
  if (!a) return a;
  return a.replace(/_/g, ' ');
}

// basic payload validation
function validate() {
  error.value = null;
  if (!form.value.flightNumber) return 'flightNumber is required';
  if (!Array.isArray(form.value.segments) || form.value.segments.length === 0) return 'at least one segment is required';
  for (const [i,s] of form.value.segments.entries()) {
    if (!s.origin?.code) return `segments[${i}].origin.code required`;
    if (!s.destination?.code) return `segments[${i}].destination.code required`;
    if (!s.departureTime) return `segments[${i}].departureTime required`;
    if (!s.arrivalTime) return `segments[${i}].arrivalTime required`;
    // Validate that arrival time is after departure time
    if (s.departureTime && s.arrivalTime) {
      const depDate = new Date(s.departureTime);
      const arrDate = new Date(s.arrivalTime);
      if (arrDate <= depDate) {
        return `segments[${i}]: arrival time must be after departure time`;
      }
    }
  }
  if (!Array.isArray(form.value.fareClasses) || form.value.fareClasses.length === 0) return 'at least one fare class required';
  return null;
}

async function onSubmit() {
  const vErr = validate();
  if (vErr) { error.value = vErr; return; }
  submitting.value = true;
  try {
    // prepare payload
    const payload = JSON.parse(JSON.stringify(form.value));
    // ensure segmentIndex sequence
    payload.segments = payload.segments.map((s, i) => ({ ...s, segmentIndex: i+1 }));
    let res;
    if (isEdit.value) {
      res = await updateFlight(props.initial._id, payload);
    } else {
      res = await createFlight(payload);
    }
    emits('saved', res?.data ?? res);
  } catch (err) {
    error.value = err?.response?.data?.message || err?.message || 'Save failed';
    console.error('AdminFlightForm save error', err);
  } finally {
    submitting.value = false;
  }
}
</script>