<script setup lang="ts">
import GroupCard from '@/components/group/GroupCard.vue';
import { groupApi } from '@/endpoints/groupEndpoints';
import type { Group } from '@/types/group';
import { onMounted, ref } from 'vue';
import AddGroup from './AddGroup.vue';

const groupsArray = ref<Group[] | null>([]);


const getGroups = async () => {
    try {
        const result = await groupApi.getGroups();
        if (result.success) {
            console.log("från komponent dashboard", result);
            groupsArray.value = result.data;
        }

    } catch (error) {
        console.error(error);
    }

}

onMounted(() => {
    getGroups();
});
</script>
<template>

    <AddGroup @create="getGroups()" />

    <div class="groups-container">

        <div v-for="group in groupsArray" :key="group.groupId" class="">
            <GroupCard :admin-email="group.adminEmail" :admin-name="group.adminName" :created-at="group.createdAt"
                :description="group.description" :group-id="group.groupId" :group-name="group.groupName"
                :is-admin="group.isAdmin" :joined-at="group.joinedAt" :member-count="group.memberCount">
            </GroupCard>
        </div>



    </div>
</template>