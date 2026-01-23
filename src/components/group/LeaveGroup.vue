<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { groupApi } from '@/endpoints/groupEndpoints';
import type { GroupMemberGroupDto } from '@/types/group';
import router from '@/router';

const toast = useToast();
const props = defineProps<{
    groupName: string;
    groupId: number;
    isAdmin: boolean,
    members: GroupMemberGroupDto[]
}>();


const handleLeaveGroup = async (groupId: number) => {
    if (props.isAdmin && props.members.length > 1) {
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
                summary: `You leaved the group ${props.groupName}`,
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
        <ButtonComponent @click="handleLeaveGroup(props.groupId)" danger sm center margin-y>Leave group
        </ButtonComponent>
    </section>
</template>