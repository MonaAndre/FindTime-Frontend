<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { groupApi } from '@/endpoints/groupEndpoints';
import router from '@/router';
import { userGroupStore } from '@/stores/userGroupStore';

const toast = useToast();
const groupStore = userGroupStore();


const handleLeaveGroup = async (groupId: number) => {
    if (groupStore.currentGroup!.isAdmin && groupStore.currentGroup!.memberCount>0) {
        toast.add({
            severity: "warn",
            summary: "Cannot leave group",
            detail: "You must transfer admin rights before leaving the group",
            life: 5000
        });
        router.push('/groups')
    }
    try {
        const result = await groupApi.leaveGroup(groupId);
       
        if (result.success) {
            toast.add({
                severity: "success",
                summary: `You leaved the group ${groupStore.currentGroup?.groupName}`,
                life:5000
            })
            router.push('/groups');
        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: `Failed to leave the group`,
            life:5000

        })
        console.error(error);
    }
}

</script>
<template>
    <section>
        <ButtonComponent @click="handleLeaveGroup(groupStore.currentGroup!.groupId)" danger sm center margin-y>Leave group
        </ButtonComponent>
    </section>

</template>