<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">Bookings</h2>
      <div>
        <input v-model="q" placeholder="Search PNR / user email" class="p-2 border rounded" />
        <button @click="load" class="ml-2 px-3 py-2 bg-sky-600 text-white rounded">Refresh</button>
      </div>
    </div>

    <div v-if="loading">Loading bookings...</div>

    <ul v-else class="space-y-3">
      <li v-for="b in bookings" :key="b._id" class="bg-white p-4 rounded shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-semibold">PNR: {{ b.pnr || '—' }} • {{ b.status }} • {{ b.paymentStatus }}</div>
            <div class="text-sm text-slate-600">User: {{ b.userId || b.userEmail || '—' }} • Flight: {{ b.flightId?.flightNumber || b.flightId }}</div>
            <div class="text-sm">Passengers: {{ b.passengers.map(p => p.name).join(', ') }}</div>
          </div>
          <div class="flex flex-col gap-2">
            <button @click="viewBooking(b._id)" class="px-3 py-2 border rounded">View</button>
            <button @click="onMarkPaid(b._id)" class="px-3 py-2 bg-amber-500 rounded">Mark Paid</button>
            <button @click="onConfirm(b._id)" class="px-3 py-2 bg-emerald-600 text-white rounded">Confirm</button>
            <button @click="onCancel(b._id)" class="px-3 py-2 bg-red-500 text-white rounded">Cancel</button>
          </div>
        </div>

        <div v-if="selected === b._id" class="mt-3 p-3 bg-slate-50 rounded">
          <pre class="text-xs">{{ b }}</pre>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listBookings, markBookingPaid, confirmBooking, cancelBookingAdmin, getBookingAdmin } from '../../services/admin.bookings.service';

const bookings = ref([]);
const loading = ref(false);
const q = ref('');
const selected = ref(null);

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
    // show expanded view with returned booking
    selected.value = id;
    const idx = bookings.value.findIndex(b => b._id === id);
    if (idx >= 0) bookings.value[idx] = res.data.booking || res.data;
  } catch (err) { console.error(err); }
}

async function onMarkPaid(id) {
  if (!confirm('Mark booking as paid?')) return;
  try {
    await markBookingPaid(id);
    alert('Marked as paid');
    await load();
  } catch (err) { alert(err?.response?.data?.message || err.message); }
}

async function onConfirm(id) {
  if (!confirm('Confirm booking (generate ticket)?')) return;
  try {
    const res = await confirmBooking(id);
    alert('Confirmed: ' + (res.data?.ticket?.barcodeUrl ? 'Ticket generated' : 'Confirmed'));
    await load();
  } catch (err) { alert(err?.response?.data?.message || err.message); }
}

async function onCancel(id) {
  if (!confirm('Cancel booking?')) return;
  try {
    await cancelBookingAdmin(id);
    alert('Cancelled');
    await load();
  } catch (err) { alert(err?.response?.data?.message || err.message); }
}

onMounted(load);
</script>
