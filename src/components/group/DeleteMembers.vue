<script setup lang="ts">
import { computed } from 'vue'
import type { GroupMemberGroupDto } from '@/types/group'
import { TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  members: GroupMemberGroupDto[]
}>()
const emit = defineEmits<{
  (e: 'remove', userId: string, userEmail: string): void
}>()

const removableMembers = computed(() => props.members.filter((m) => !m.isAdmin))
</script>

<template>
  <div class="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-700">
    <p class="label-custom mb-2">Remove members</p>
    <ul
      v-if="removableMembers.length"
      class="scrollbar-thin flex max-h-56 flex-col divide-y divide-zinc-200 overflow-y-auto dark:divide-zinc-800"
    >
      <li
        v-for="member in removableMembers"
        :key="member.userId"
        class="flex items-center justify-between gap-3 py-1.5"
      >
        <p class="truncate text-sm">{{ member.firstName }} {{ member.lastName }}</p>
        <button
          type="button"
          class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          @click="emit('remove', member.userId, member.email)"
        >
          <TrashIcon class="h-4 w-4" />Remove
        </button>
      </li>
    </ul>
    <p v-else class="text-sm text-zinc-500 dark:text-zinc-400">No other members to remove.</p>
  </div>
</template>
