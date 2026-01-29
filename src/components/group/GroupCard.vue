<script setup lang="ts">
import type { Group } from '@/types/group'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useRouter } from 'vue-router'
import { getBgColors } from '@/helpers/colors'
const router = useRouter()
const props = defineProps<Group>()
const goToGroupPage = () => {
  router.push({ name: 'group', params: { id: props.groupId } })
}
</script>
<template>
  <div :class="getBgColors(props.groupColor)" class="p-3 rounded-2xl">
    <h2>{{ props.groupName }}</h2>
    <p>Id: {{ props.groupId }}</p>
    <ButtonComponent md primary @click="goToGroupPage()">Open Calendar</ButtonComponent>
  </div>
</template>
