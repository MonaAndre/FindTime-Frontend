<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types/auth';
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';

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
        <TextInput type="email" name="email" autocomplete="email" inputmode="email" v-model="loginRequest.email">
            Email
        </TextInput>
        <TextInput type="password" name="password" autocomplete="current-password" :show-password-toggle="true">
            Password
        </TextInput>
        <ButtonComponent primary md >Login</ButtonComponent>
    </form>
    <div v-if="authStore.isAuthenticated" class="">Is logged in</div>
</template>