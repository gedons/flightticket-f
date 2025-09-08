<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-semibold">Tickets</h2>
      <div>
        <input v-model="q" placeholder="Search PNR or booking id" class="p-2 border rounded" />
        <button @click="load" class="ml-2 px-3 py-2 bg-sky-600 text-white rounded">Refresh</button>
      </div>
    </div>

    <div v-if="loading" class="text-sm text-slate-600">Loading tickets...</div>

    <ul v-else class="space-y-3">
      <li v-for="t in tickets" :key="t._id" class="bg-white p-4 rounded shadow flex justify-between items-center">
        <div>
          <div class="font-semibold">Booking: {{ t.bookingId }} • Issued: {{ t.issuedAt ? new Date(t.issuedAt).toLocaleString() : '-' }}</div>
          <div class="text-sm">PDF: <a :href="t.eTicketPdfUrl" target="_blank" class="text-sky-600">Download</a></div>
        </div>
        <div class="flex gap-2">
          <button @click="view(t._id)" class="px-3 py-2 border rounded">View</button>
          <button @click="remove(t._id)" class="px-3 py-2 bg-red-500 text-white rounded">Delete</button>
        </div>
      </li>
    </ul>

    <!-- Modal for viewing ticket -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-white rounded shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="font-semibold">Ticket for booking {{ modalTicket?.bookingId || '' }}</div>
          <button @click="closeModal" class="px-3 py-1 bg-red-500 text-white rounded">Close</button>
        </div>

        <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="mb-3">
              <strong>Issued:</strong> {{ modalTicket?.issuedAt ? new Date(modalTicket.issuedAt).toLocaleString() : '-' }}
            </div>
            <div v-if="modalTicket?.barcodeUrl">
              <img :src="modalTicket.barcodeUrl" alt="QR" class="w-48 h-48" />
            </div>
            <div v-else class="text-sm text-slate-500">No QR image available.</div>
          </div>

          <div>
            <div v-if="modalTicket?.eTicketPdfUrl" class="h-[60vh]">
              <iframe :src="modalTicket.eTicketPdfUrl" class="w-full h-full border" frameborder="0"></iframe>
            </div>
            <div v-else class="text-sm text-slate-500">No PDF available for this ticket.</div>
          </div>
        </div>
      </div>
    </div>
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
  if (!confirm('Delete ticket?')) return;
  try {
    await deleteTicketAdmin(id);
    alert('Deleted');
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
