<script setup lang="ts">
import { computed } from 'vue'
import router from '@/router'
import type { Group } from '@/types/group'
import { userGroupStore } from '@/stores/userGroupStore'
import { storeToRefs } from 'pinia'
import { CalendarDaysIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  groups: Group[]
}>()

const store = userGroupStore()
const { eventsNextWeek } = storeToRefs(store)

const twoFirstGroups = computed(() => props.groups.slice(0, 2))

const getIconBg = (color: string): string => {
  const map: Record<string, string> = {
    zinc: 'bg-zinc-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-600',
    orange: 'bg-orange-500',
    teal: 'bg-teal-600',
    sky: 'bg-sky-500',
    purple: 'bg-purple-600',
    lime: 'bg-lime-500',
  }
  return map[color] ?? 'bg-zinc-500'
}

const getMemberLabel = (group: Group): string => {
  if (group.memberCount === 1) return 'Just you'
  if (!group.isAdmin) {
    const extra = group.memberCount - 2
    return extra > 0 ? `You, ${group.adminName} +${extra}` : `You, ${group.adminName}`
  }
  return `You +${group.memberCount - 1}`
}

const getNextEvent = (group: Group) => {
  return eventsNextWeek.value
    .filter((e) => e.groupName === group.groupName)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0]
}

const formatEventTime = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) return `Today ${time}`
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  ) return `Tomorrow ${time}`
  return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${time}`
}
</script>

<template>
  <section class="flex items-center justify-between px-2 ">
    <h2 class="font-bold text-white text-lg">Your calendars</h2>
    <button
      class="text-blue-500 font-semibold hover:text-blue-400 cursor-pointer text-sm"
      @click="router.push('/groups')"
    >
      View all
    </button>
  </section>

  <section class="grid grid-cols-2 gap-4">
    <div
      v-for="group in twoFirstGroups"
      :key="group.groupId"
      class="p-4 bg-zinc-900 rounded-xl flex flex-col gap-4 cursor-pointer hover:bg-zinc-700 transition-colors"
      @click="router.push(`/group/details/${group.groupId}`)"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          :class="getIconBg(group.groupColor)"
        >
          <CalendarDaysIcon class="w-5 h-5 text-white" />
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-white truncate">{{ group.groupName }}</p>
          <p class="text-xs text-zinc-400 truncate">{{ getMemberLabel(group) }}</p>
        </div>
      </div>

      <div>
        <p class="text-xs text-zinc-500 mb-0.5">Next up</p>
        <template v-if="getNextEvent(group)">
          <p class="text-sm font-semibold text-white truncate">
            {{ getNextEvent(group)!.eventName }} · {{ formatEventTime(getNextEvent(group)!.startTime) }}
          </p>
        </template>
        <p v-else class="text-sm text-zinc-500 italic">No upcoming events</p>
      </div>
    </div>
  </section>
</template>
