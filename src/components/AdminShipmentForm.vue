<template>
  <div class="max-h-[80vh] overflow-y-auto pr-2 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400">
    <!-- Header -->
    <div class="text-center pb-6 border-b border-slate-200">
      <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-8 5-8-5"></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-800 mb-2">
        {{ isEdit ? 'Edit Shipment' : 'Create New Shipment' }}
      </h2>
      <p class="text-slate-600">{{ isEdit ? 'Update shipment information' : 'Fill in the details to create a new shipment' }}</p>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-8">
      <!-- Basic Information -->
      <div class="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
          Basic Information
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Tracking / Waybill Number</label>
            <input 
              v-model="form.trackingCode" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Leave blank to auto-generate"
            />
            <p class="text-xs text-slate-500">Will be generated automatically if left empty</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Shipment Date</label>
            <input 
              v-model="form.shipmentDate" 
              type="date" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-slate-700 mb-2">Service Type</label>
          <select 
            v-model="form.serviceType" 
            class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Air cargo">Air Cargo</option>
            <option value="Ground shipping">Ground Shipping</option>
            <option value="Express delivery">Express Delivery</option>
            <option value="Standard delivery">Standard Delivery</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>

      <!-- Sender Information -->
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div class="w-2 h-2 bg-green-600 rounded-full"></div>
          Sender (Consignor)
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Full Name</label>
            <input 
              v-model="form.consignor.fullName" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Enter sender's full name"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Address</label>
            <input 
              v-model="form.consignor.address" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Enter sender's address"
            />
          </div>
        </div>
      </div>

      <!-- Recipient Information -->
      <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div class="w-2 h-2 bg-purple-600 rounded-full"></div>
          Recipient (Consignee)
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Full Name</label>
            <input 
              v-model="form.consignee.fullName" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Enter recipient's full name"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Address</label>
            <input 
              v-model="form.consignee.address" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Enter recipient's address"
            />
          </div>
        </div>
      </div>

      <!-- Package Details -->
      <div class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div class="w-2 h-2 bg-orange-600 rounded-full"></div>
          Package Details
        </h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Content Description</label>
            <input 
              v-model="form.contentDetails" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="e.g. Documents, Electronics, Cash funds"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Quantity</label>
              <input 
                v-model.number="form.quantity" 
                type="number" 
                min="1"
                class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Receiver Contact/Info</label>
              <input 
                v-model="form.receiver" 
                class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="Phone number or contact info"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Destination Address</label>
            <input 
              v-model="form.destination.address" 
              class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-slate-400"
              placeholder="Final delivery address"
            />
          </div>
        </div>
      </div>

      <!-- Image Upload -->
      <div class="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6">
        <h3 class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <div class="w-2 h-2 bg-rose-600 rounded-full"></div>
          Package Image
        </h3>
        
        <div class="space-y-4">
          <div v-if="!form.image?.url" class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors">
            <svg class="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="text-slate-600 mb-4">Upload an image of the package (optional)</p>
            
            <div class="flex flex-col sm:flex-row gap-3 items-center justify-center">
              <input 
                type="file" 
                accept="image/*" 
                @change="onFileChange"
                class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200 transition-colors"
              />
              <button 
                v-if="selectedFile && !uploaded" 
                @click.prevent="uploadFile" 
                :disabled="uploading"
                class="px-6 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                <svg v-if="uploading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ uploading ? 'Uploading...' : 'Upload Image' }}</span>
              </button>
            </div>
          </div>

          <div v-if="form.image?.url" class="relative inline-block">
            <img :src="form.image.url" class="w-64 h-64 object-cover rounded-xl shadow-lg" />
            <button 
              @click.prevent="removeImage" 
              class="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
        <div class="flex items-center gap-2 text-red-700">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200">
        <button 
          type="button" 
          @click="$emit('cancel')" 
          class="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 font-semibold rounded-xl transition-all duration-200"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          :disabled="submitting"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
        >
          <svg v-if="submitting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ submitting ? 'Saving...' : (isEdit ? 'Update Shipment' : 'Create Shipment') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createShipment, updateShipment, uploadImage } from '../services/shipments.service';

const props = defineProps({ initial: { type: Object, default: null } });
const emits = defineEmits(['saved','cancel']);
const isEdit = !!props.initial;

const error = ref(null);
const selectedFile = ref(null);
const uploaded = ref(false);
const uploading = ref(false);
const submitting = ref(false);

const form = ref({
  trackingCode: '',
  shipmentDate: new Date().toISOString().slice(0,10),
  serviceType: 'Air cargo',
  consignor: { fullName: '', address: '' },
  consignee: { fullName: '', address: '' },
  contentDetails: '',
  quantity: 1,
  receiver: '',
  destination: { address: '', coords: { type: 'Point', coordinates: [0,0] } },
  image: null
});

if (props.initial) {
  form.value = JSON.parse(JSON.stringify(props.initial));
  if (form.value.image) uploaded.value = true;
}

function onFileChange(e) {
  selectedFile.value = e.target.files && e.target.files[0] ? e.target.files[0] : null;
  error.value = null;
}

async function uploadFile() {
  if (!selectedFile.value) { 
    error.value = 'Please select a file first'; 
    return; 
  }
  
  uploading.value = true;
  error.value = null;
  
  try {
    const res = await uploadImage(selectedFile.value);
    const out = res?.data?.upload ?? res?.data ?? res;
    form.value.image = { 
      url: out.url || out.secure_url, 
      public_id: out.public_id, 
      bytes: out.bytes, 
      format: out.format, 
      raw: out.raw 
    };
    selectedFile.value = null;
    uploaded.value = true;
  } catch (err) {
    error.value = err?.response?.data?.message || err?.message || 'Upload failed';
  } finally {
    uploading.value = false;
  }
}

function removeImage() {
  form.value.image = null;
  uploaded.value = false;
  selectedFile.value = null;
}

async function onSubmit() {
  error.value = null;
  submitting.value = true;
  
  try {
    const payload = JSON.parse(JSON.stringify(form.value));
    
    if (isEdit) {
      await updateShipment(props.initial._id, payload);
    } else {
      await createShipment(payload);
    }
    
    emits('saved');
  } catch (err) {
    error.value = err?.response?.data?.message || err?.message || 'Save failed';
  } finally {
    submitting.value = false;
  }
}
</script>