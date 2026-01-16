<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();

const logout = async () => {
    try {
        const result = await auth.logout();
        if (result.success) {
            console.log("Logout successful");
            router.push('/');
        }
    } catch (error) {
        console.error(error);
    }
}
</script>
<template>
      <div>

      <nav class="flex gap-5">
        <RouterLink to="/">Home</RouterLink>
         <RouterLink v-if="auth.isAuthenticated" to="/dashboard">Dashboard</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/register">Register</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/login">Login</RouterLink>
           <button v-if="auth.isAuthenticated" @click="logout">Logout</button>
      </nav>
    </div>
</template>