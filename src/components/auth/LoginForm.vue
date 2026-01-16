<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types/auth';
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useRouter } from 'vue-router';

const loginRequest = ref<LoginRequest>({
    email: '',
    password: ''
});
const authStore = useAuthStore();
const router = useRouter(); 
const login = async () => {
    try {
        const result = await authStore.login(loginRequest.value!);
        if (result.success) {
            console.log("från login componen: Login successful", result.data);
           router.push('/groups');
        }
    } catch (error) {
        console.error(error);
    }
}
</script>
<template>
    <h1 class="form-title">Login här</h1>
    <form class="form " @submit.prevent="login">
        <TextInput type="email" name="email" autocomplete="email" inputmode="email" v-model="loginRequest.email">
            Email
        </TextInput>
        <TextInput type="password" name="password" autocomplete="current-password" v-model="loginRequest.password" :show-password-toggle="true">
            Password
        </TextInput>
        <div class="text-center mt-5">
            <ButtonComponent type="submit" primary lg center>Login</ButtonComponent>

        </div>
    </form>
</template>