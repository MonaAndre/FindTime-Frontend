<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types/auth';
import { ref } from 'vue';


const loginRequest = ref<LoginRequest>({
    email: '',
    password: ''
});
const authStore = useAuthStore();

const login = async () => {
    try {
        const result = await authStore.login(loginRequest.value!);
        if (result.success) {
            console.log("från login componen: Login successful", result.data);
        }
    } catch (error) {
        console.error(error);
    }
}
</script>

<template>
    <h1>Login Page</h1>
    <form @submit.prevent="login">
        <label>email</label>: <input v-model="loginRequest.email" type="text" name="email" /><br />
        <label>password</label>: <input v-model="loginRequest.password" type="password" name="password" /><br />
        <input type="submit" value="Login" />
    </form>
    <div v-if="authStore.isAuthenticated" class="">Is logged in</div>
</template>