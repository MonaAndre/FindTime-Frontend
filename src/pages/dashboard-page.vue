<script setup lang="ts">
import GroupCard from '@/components/GroupCard.vue';
import { useAuthStore } from '@/stores/authStore';
import { useGroupStore } from '@/stores/groupStore';
import type { Group } from '@/types/group';
import { ref } from 'vue';

const authStore = useAuthStore();
const groupStore = useGroupStore();
const groupsArray = ref<Group[] | null>([]);

const logout = async () => {
    try {
        const result = await authStore.logout();
        if (result.success) {
            console.log("Logout successful");
        }
    } catch (error) {
        console.error(error);
    }
}

const getGroups = async () => {
    try {
        const result = await groupStore.getGroups();
        if (result.success) {
            console.log("från komponent dashboard", result);
            groupsArray.value = result.data;
        }

    } catch (error) {
        console.error(error);
    }

}

</script>

<template>
    <h1>Dashboard Page</h1>
    <button @click="logout">Logout</button>

    <button @click="getGroups">get users groups</button>


    <div class="groups-container">

        <div v-for="group in groupsArray" :key="group.groupId" class="">
            <GroupCard :admin-email="group.adminEmail" :admin-name="group.adminName" :created-at="group.createdAt"
                :description="group.description" :group-id="group.groupId" :group-name="group.groupName"
                :is-admin="group.isAdmin" :joined-at="group.joinedAt" :member-count="group.memberCount">
            </GroupCard>
        </div>



    </div>
</template>