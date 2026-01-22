<script setup lang="ts">
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import { ref } from 'vue';
import { userApi } from '@/endpoints/userEndpoints';
import { useToast } from 'primevue/usetoast';
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';

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
    <h3 class="text-red-700 text-3xl text-center mt-10 mb-5 ">Danger Zone</h3>
  <div class="border form border-red-700 rounded-2xl p-4 ">
        <p>Attention!</p>
        <p>After deleting account you will not be able to restore it</p>
        <ButtonComponent @click="confirm1()" danger lg>
            Delete Account
        </ButtonComponent>
        <ConfirmDialog />
    </div>
</template>