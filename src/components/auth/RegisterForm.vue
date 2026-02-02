<script setup lang="ts">
import { authApi } from '@/endpoints/authEndpoints';
import router from '@/router';
import type { RegisterRequest } from '@/types/auth';
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';

const registerRequest = ref<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthday: ''
});
const register = async () => {
    try {
        const result = await authApi.register(registerRequest.value!);
        if (result.success) {
            console.log("från register componen: Register successful", result.data);
            router.push('/login');
        }
    } catch (error) {
        console.error(error);
    }

}
</script>
<template>
    <h1 class="form-title">Register your account</h1>
    <form class="form" @submit.prevent="register">
        <TextInput type="email" name="email" autocomplete="email" inputmode="email" v-model="registerRequest.email">
            Email
        </TextInput>
        <TextInput type="password" name="password" autocomplete="current-password" v-model="registerRequest.password"
            :show-password-toggle="true">
            Password
        </TextInput>
        <TextInput type="password" name="password" v-model="registerRequest.confirmPassword"
            :show-password-toggle="true">
            Confirm password
        </TextInput>

        <TextInput type="text" name="firstName" v-model="registerRequest.firstName" autocomplete="given-name">
            Name
        </TextInput>
        <TextInput type="text" name="lastName" v-model="registerRequest.lastName" autocomplete="family-name">
            Last name
        </TextInput>
        <TextInput type="date" name="birthday" autocomplete="bday" v-model="registerRequest.birthday">
            Birthday
        </TextInput>
        <div class="flex justify-center">
            <ButtonComponent class="" type="submit" marginY primary lg>Register</ButtonComponent>
        </div>
    </form>
</template>