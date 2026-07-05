<script setup lang="ts">
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import { ref } from 'vue';
import { userApi } from '@/endpoints/userEndpoints';
import { useToast } from 'primevue/usetoast';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/vue/24/outline';

const confirm = useConfirm();
const isVisible = ref(false);
const toast = useToast();
const auth = useAuthStore()

 const handleDeleteUser = async () => {
        try {
            const result = await userApi.deleteUser();
            if (result.success) {
                toast.add({
                    severity: "success",
                    summary: "User deleted",
                    life: 5000
                })
                auth.isAuthenticated=false;
                router.push('/');
            }

        } catch (error) {
            toast.add({
                severity: "error",
                summary: "Failed to delete user",
                life: 5000
            })
            console.error(error);
        }
    }

const confirm1 = () => {
    confirm.require({
        message: 'Are you sure you want to delete your account?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
        acceptClass:'p-button-danger',
        rejectClass:'p-button-text',
        accept: handleDeleteUser,

        onShow: () => {
            isVisible.value = true;
        },
        onHide: () => {
            isVisible.value = false;
        }
    });


};
</script>
<template>
    <div class="bg-red-50/60 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/60 p-5 md:p-6">
        <div class="flex items-center gap-2 pb-5 mb-5 border-b border-red-100 dark:border-red-900/40">
            <div
                class="w-9 h-9 shrink-0 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5" />
            </div>
            <div>
                <h2 class="font-bold text-lg leading-tight text-red-700 dark:text-red-500">Danger zone</h2>
                <p class="text-sm text-red-700/70 dark:text-red-400/70">Irreversible and destructive actions</p>
            </div>
        </div>

        <div class="flex items-center justify-between gap-4 flex-wrap">
            <p class="text-sm text-zinc-700 dark:text-zinc-300 max-w-sm">
                Deleting your account will permanently remove your data. This action cannot be undone.
            </p>
            <ButtonComponent @click="confirm1()" danger lg>
                <TrashIcon class="w-4 h-4 mr-1.5" />
                Delete account
            </ButtonComponent>
        </div>
        <ConfirmDialog />
    </div>
</template>
