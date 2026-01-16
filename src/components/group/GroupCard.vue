<script setup lang="ts">
import type { Group } from '@/types/group';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps<Group>();
const goToGroupPage = () => {
  router.push({ name: 'group', params: { id: props.groupId } });
}

</script>
<template>
    <h2>{{ props.groupName }}</h2>
    <p>Id: {{ props.groupId }}</p>
    <ButtonComponent md primary @click="goToGroupPage()">Open Calendar</ButtonComponent>

</template>