<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const logout = async () => {
    try {
        const result = await authStore.logout();
        if (result.success) {
            console.log("Logout successful");
        }
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <h1>Dashboard Page</h1>
    <button @click="logout">Logout</button>
</template>