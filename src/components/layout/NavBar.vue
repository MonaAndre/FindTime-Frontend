<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { Cog8ToothIcon } from '@heroicons/vue/24/outline';

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

        <nav class="flex  md:flex-col gap-5 items-center md:items-start justify-between flex-row p-3">
            <div class="flex md:flex-col md:items-start gap-10">
                <RouterLink class="" to="/">Home</RouterLink>
                <RouterLink v-if="auth.isAuthenticated" to="/groups">Groups</RouterLink>
                <RouterLink v-if="!auth.isAuthenticated" to="/register">Register</RouterLink>
                <RouterLink v-if="!auth.isAuthenticated" to="/login">Login</RouterLink>

                <RouterLink v-if="auth.isAuthenticated" to="/settings">
                    <Cog8ToothIcon class="h-5 w-5" />
                </RouterLink>
            </div>

            <button type="button" class="cursor-pointer" v-if="auth.isAuthenticated" @click="logout">Logout</button>
        </nav>
    </div>
</template>