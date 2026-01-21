<script setup lang="ts">
import type { Group } from '@/types/group';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
const router = useRouter();
const props = defineProps<Group>();
const goToGroupPage = () => {
  router.push({ name: 'group', params: { id: props.groupId } });
}
console.log(props.groupColor)
const bgClass = computed(() => {
  const colorMap: Record<string, string> = {
    'zinc': 'bg-zinc-200 dark:bg-zinc-600',
    'red': 'bg-red-200 dark:bg-red-600',
    'blue': 'bg-blue-200 dark:bg-blue-600',
    'green': 'bg-green-200 dark:bg-green-600',
  };
  const color = props.groupColor || 'red';
  return colorMap[color] || 'bg-red-500 dark:bg-zinc-500';
})
</script>
<template>
  <div :class='bgClass' class="p-3 rounded-2xl">
    <h2>{{ props.groupName }}</h2>
    <p>Id: {{ props.groupId }}</p>
    <ButtonComponent md primary @click="goToGroupPage()">Open Calendar</ButtonComponent>
  </div>


</template>