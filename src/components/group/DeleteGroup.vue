<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useToast } from 'primevue/usetoast';
import router from '@/router';
import { userGroupStore } from '@/stores/userGroupStore';

const groupStore = userGroupStore();
const toast = useToast();
const handleDeleteGroup = async (groupId: number) => {
    try {
        const result = await groupApi.deleteGroup(groupId);
        if (result.success) {
            toast.add({
                severity: 'success',
                summary: 'Group deleted successfully',
                life: 5000
            })
            router.push('/groups');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Failed to delete group',
            life: 5000
        })
        console.error(error);
    }
}

</script>
<template>
    <section>
        <ButtonComponent @click="handleDeleteGroup(groupStore.currentGroup!.groupId)" sm center danger margin-y>Delete
            group</ButtonComponent>
    </section>
</template>