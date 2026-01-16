<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import type { ChangePassword } from '@/types/auth';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useAuthStore } from '@/stores/authStore';
const auth = useAuthStore();
const changePasswordForm = ref<ChangePassword>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
});

const changePassword = async () => {
    try {
        const result = await auth.changePassword(changePasswordForm.value!);
        console.log(changePasswordForm.value)
        if (result?.success) {
            console.log("PASSWORD CHANGED");
            changePasswordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };

        }


    } catch (error) {
        console.error(error)

    }
}
</script>

<template>
    <h1 class="form-title">Change password</h1>
    <form class="form" @submit.prevent="changePassword">
        <TextInput type="password" name="current-password" autocomplete="current-password"
            v-model="changePasswordForm.currentPassword" :show-password-toggle="true">
            Current password
        </TextInput>
        <TextInput type="password" name="new-password" autocomplete="new-password"
            v-model="changePasswordForm.newPassword" :show-password-toggle="true">
            New password
        </TextInput>
        <TextInput type="password" name="password" v-model="changePasswordForm.confirmNewPassword"
            :show-password-toggle="true">
            Confirm password
        </TextInput>
        <ButtonComponent primary lg center type="submit">Change password</ButtonComponent>

    </form>
</template>