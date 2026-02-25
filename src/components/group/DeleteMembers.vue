<script setup lang="ts">
import type { GroupMemberGroupDto } from '@/types/group'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
defineProps<{
  members: GroupMemberGroupDto[]
}>()
const emit = defineEmits<{
  (e: 'remove', userId: string, userEmail: string): void
}>()
</script>

<template>
  <ul class="flex flex-col gap-3 mt-5">
    <li v-for="member in members.filter(a => !a.isAdmin)" :key="member.userId" class="flex justify-between items-center">
      <p>{{ member.firstName }}</p>
      <ButtonComponent sm danger @click="emit('remove', member.userId, member.email)"
        ><TrashIcon class="h-5 w-5"
      />Remove</ButtonComponent>
    </li>
  </ul>
</template>
