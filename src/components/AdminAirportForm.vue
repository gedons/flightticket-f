<template>
  <div class="bg-white p-4 rounded shadow">
    <h3 class="text-lg font-semibold mb-3">{{ isEdit ? 'Edit Airport' : 'Create Airport' }}</h3>

    <form @submit.prevent="submit" class="space-y-3">
      <div class="grid grid-cols-2 gap-2">
        <input v-model="form.code" placeholder="IATA Code (e.g. LAG)" class="p-2 border rounded" required />
        <input v-model="form.name" placeholder="Name (e.g. Murtala Muhammed Intl.)" class="p-2 border rounded" required />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <input v-model="form.city" placeholder="City" class="p-2 border rounded" />
        <input v-model="form.country" placeholder="Country" class="p-2 border rounded" />
      </div>

      <div>
        <label class="block text-sm mb-1">Timezone (tz database name)</label>
        <input v-model="form.timezone" placeholder="Africa/Lagos" class="p-2 border rounded w-full" />
      </div>

      <div>
        <label class="block text-sm mb-1">Coordinates (optional)</label>
        <div class="grid grid-cols-2 gap-2">
          <input v-model.number="form.lat" placeholder="Latitude" class="p-2 border rounded" />
          <input v-model.number="form.lon" placeholder="Longitude" class="p-2 border rounded" />
        </div>
      </div>

      <div class="flex gap-2">
        <button class="px-3 py-2 bg-sky-600 text-white rounded" :disabled="loading">
          {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
        </button>
        <button type="button" @click="$emit('cancel')" class="px-3 py-2 border rounded">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
const props = defineProps({
  model: { type: Object, default: null }
});
const emit = defineEmits(['saved', 'cancel']);

const isEdit = !!props.model;
const loading = ref(false);

const form = reactive({
  code: props.model?.code || '',
  name: props.model?.name || '',
  city: props.model?.city || '',
  country: props.model?.country || '',
  timezone: props.model?.timezone || '',
  lat: props.model?.lat || null,
  lon: props.model?.lon || null
});

watch(() => props.model, (m) => {
  if (m) {
    form.code = m.code || '';
    form.name = m.name || '';
    form.city = m.city || '';
    form.country = m.country || '';
    form.timezone = m.timezone || '';
    form.lat = m.lat || null;
    form.lon = m.lon || null;
  }
});

async function submit() {
  loading.value = true;
  try {
    // basic normalization
    const payload = {
      code: (form.code || '').toString().trim().toUpperCase(),
      name: (form.name || '').toString().trim(),
      city: (form.city || '').toString().trim(),
      country: (form.country || '').toString().trim(),
      timezone: (form.timezone || '').toString().trim(),
      lat: form.lat || undefined,
      lon: form.lon || undefined
    };
    emit('saved', payload);
  } finally {
    loading.value = false;
  }
}
</script>
