<script setup lang="ts">
import Toast from 'primevue/toast';
import AppLayout from './components/layout/AppLayout.vue';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { isAuthenticated } = storeToRefs(authStore);

watch(
  isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      notificationStore.connect();
    } else {
      notificationStore.disconnect();
    }
  },
);
</script>

<template>
  <Toast/>
  <AppLayout />
</template>
