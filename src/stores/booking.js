// src/stores/booking.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBookingStore = defineStore('booking', () => {
  const currentFlight = ref(null);
  const selectedFareClass = ref(null);
  const passengerCount = ref(1);
  const passengers = ref([]);
  const seats = ref([]); // optional seat numbers

  function reset() {
    currentFlight.value = null;
    selectedFareClass.value = null;
    passengerCount.value = 1;
    passengers.value = [];
    seats.value = [];
  }

  return {
    currentFlight, selectedFareClass, passengerCount, passengers, seats,
    reset
  };
});
