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
  <div class="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-700">
    <p class="label-custom mb-3">Remove members</p>
    <ul class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
      <li
        v-for="member in members.filter((a) => !a.isAdmin)"
        :key="member.userId"
        class="flex items-center justify-between py-2"
      >
        <p class="truncate">{{ member.firstName }} {{ member.lastName }}</p>
        <ButtonComponent sm danger @click="emit('remove', member.userId, member.email)"
          ><TrashIcon class="mr-1 h-4 w-4" />Remove</ButtonComponent
        >
      </li>
    </ul>
  </div>
</template>
