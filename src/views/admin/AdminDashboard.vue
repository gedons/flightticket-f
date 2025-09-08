<template>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Admin Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-slate-500">Flights</div>
        <div class="text-2xl font-bold">{{ stats.flights }}</div>
        <router-link to="/admin/flights" class="text-sky-600 text-sm">Manage flights</router-link>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-slate-500">Bookings</div>
        <div class="text-2xl font-bold">{{ stats.bookings }}</div>
        <router-link to="/admin/bookings" class="text-sky-600 text-sm">View bookings</router-link>
      </div>

      <div class="bg-white p-4 rounded shadow">
        <div class="text-sm text-slate-500">Tickets</div>
        <div class="text-2xl font-bold">{{ stats.tickets }}</div>
        <router-link to="/admin/tickets" class="text-sky-600 text-sm">Manage tickets</router-link>
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
