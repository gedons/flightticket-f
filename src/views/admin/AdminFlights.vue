<template>
  <div class="max-w-5xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">Manage Flights</h2>
      <button @click="showCreate = true" class="px-3 py-2 bg-sky-600 text-white rounded">Create Flight</button>
    </div>

    <div v-if="showCreate" class="mb-4">
      <AdminFlightForm @saved="onCreate" @cancel="showCreate=false" />
    </div>

    <div v-if="loading">Loading flights...</div>
    <ul v-else class="space-y-3">
      <li v-for="f in flights" :key="f._id" class="bg-white p-4 rounded shadow flex justify-between items-center">
        <div>
          <div class="font-semibold">{{ f.flightNumber }} — {{ f.origin.code }} → {{ f.destination.code }}</div>
          <div class="text-sm text-slate-600">{{ new Date(f.departureTime).toLocaleString() }}</div>
        </div>
        <div class="flex gap-2">
          <button @click="onEdit(f)" class="px-3 py-2 border rounded">Edit</button>
          <button @click="onDelete(f._id)" class="px-3 py-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      </li>
    </ul>

    <div v-if="editing" class="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
      <div class="bg-white p-4 rounded w-full max-w-2xl">
        <h3 class="text-lg mb-2">Edit Flight</h3>
        <AdminFlightForm :model="editing" @saved="onUpdate" @cancel="editing=null" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminFlightForm from '../../components/AdminFlightForm.vue';
import { listFlights, createFlight, updateFlight, deleteFlight } from '../../services/admin.flights.service';

const flights = ref([]);
const loading = ref(false);
const showCreate = ref(false);
const editing = ref(null);

async function load() {
  loading.value = true;
  try {
    const res = await listFlights();
    flights.value = res.data || [];
  } finally {
    loading.value = false;
  }
}

async function onCreate(payload) {
  try {
    await createFlight(payload);
    showCreate.value = false;
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

function onEdit(f) {
  editing.value = { ...f };
}

async function onUpdate(payload) {
  try {
    if (!editing.value) return;
    await updateFlight(editing.value._id, payload);
    editing.value = null;
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

async function onDelete(id) {
  if (!confirm('Delete flight?')) return;
  try {
    await deleteFlight(id);
    await load();
  } catch (err) {
    alert(err?.response?.data?.message || err.message);
  }
}

onMounted(load);
</script>
