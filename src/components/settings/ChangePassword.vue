<script setup lang="ts">
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import type { ChangePassword } from '@/types/auth';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'primevue/usetoast';
import { LockClosedIcon } from '@heroicons/vue/24/outline';

const auth = useAuthStore();
const toast = useToast();
const saving = ref(false);

const changePasswordForm = ref<ChangePassword>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
});

const changePassword = async () => {
    saving.value = true;
    try {
        const result = await auth.changePassword(changePasswordForm.value!);
        if (result?.success) {
            toast.add({
                severity: "success",
                summary: "Password changed",
                life: 5000
            })
            changePasswordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
        }

    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to change password",
            life: 5000
        })
        console.error(error)

    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 md:p-6">
        <div class="flex items-center gap-2 pb-5 mb-5 border-b border-zinc-100 dark:border-zinc-800">
            <div
                class="w-9 h-9 shrink-0 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <LockClosedIcon class="w-5 h-5" />
            </div>
            <div>
                <h2 class="font-bold text-lg leading-tight">Password &amp; security</h2>
                <p class="text-sm text-zinc-500 dark:text-zinc-400">Update your password to keep your account secure</p>
            </div>
        </div>

        <form class="flex flex-col" @submit.prevent="changePassword">
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

            <div class="flex justify-end mt-6">
                <ButtonComponent primary lg type="submit" :loading="saving">Change password</ButtonComponent>
            </div>
        </form>
    </div>
</template>
