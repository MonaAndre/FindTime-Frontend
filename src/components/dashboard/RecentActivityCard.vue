<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { userGroupStore } from '@/stores/userGroupStore'
import { activityApi } from '@/endpoints/activityEndpoints'
import { ActivityType, type ActivityDtoResponse } from '@/types/activity'
import { getAvatarColor } from '@/helpers/colors'
import { formatRelativeTime } from '@/helpers/time'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const groupStore = userGroupStore()
const { groups } = storeToRefs(groupStore)

const activities = ref<ActivityDtoResponse[]>([])
const loading = ref(true)
const selectedGroupId = ref<number | undefined>(undefined)
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

const selectedGroupName = computed(
  () => groups.value.find((g) => g.groupId === selectedGroupId.value)?.groupName ?? 'All calendars',
)

const selectGroup = (id: number | undefined) => {
  selectedGroupId.value = id
  showDropdown.value = false
}

const fetchActivities = async (groupId: number | undefined) => {
  loading.value = true
  try {
    const res = groupId
      ? await activityApi.getGroupActivity(groupId)
      : await activityApi.getUserActivity()
    activities.value = res.success ? (res.data ?? []) : []
  } catch {
    activities.value = []
  } finally {
    loading.value = false
  }
}

watch(selectedGroupId, (id) => fetchActivities(id), { immediate: true })

const isSelf = (activity: ActivityDtoResponse) => activity.actorUserId === authStore.user?.id

const actorName = (activity: ActivityDtoResponse) =>
  isSelf(activity) ? 'You' : activity.actorFirstName

const initials = (activity: ActivityDtoResponse) =>
  `${activity.actorFirstName.charAt(0)}${activity.actorLastName.charAt(0)}`.toUpperCase()

const activityText = (activity: ActivityDtoResponse): string => {
  switch (activity.type) {
    case ActivityType.EventCreated:
      return `added ${activity.eventName}`
    case ActivityType.EventUpdated:
      return `updated ${activity.eventName}`
    case ActivityType.EventDeleted:
      return `deleted ${activity.eventName}`
    case ActivityType.MemberJoined:
      return `joined ${activity.groupName} 🎉`
    case ActivityType.RsvpResponse:
      return `RSVP'd to ${activity.eventName}`
  }
}
</script>

<template>
  <div
    class="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent p-4 flex flex-col gap-3"
  >
    <div class="flex items-center justify-between gap-2 shrink-0">
      <h2 class="font-bold text-zinc-900 dark:text-white text-lg">Recent activity</h2>
      <span class="relative" ref="dropdownRef">
        <button
          class="inline-flex items-center gap-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          @click="showDropdown = !showDropdown"
        >
          {{ selectedGroupName }}
          <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="showDropdown ? 'rotate-180' : ''" />
        </button>
        <ul
          v-if="showDropdown"
          class="absolute right-0 top-full mt-1 z-20 min-w-40 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-lg py-1 overflow-hidden"
        >
          <li
            class="px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            :class="selectedGroupId === undefined ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''"
            @click="selectGroup(undefined)"
          >
            All calendars
          </li>
          <li
            v-for="group in groups"
            :key="group.groupId"
            class="px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            :class="selectedGroupId === group.groupId ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''"
            @click="selectGroup(group.groupId)"
          >
            {{ group.groupName }}
          </li>
        </ul>
      </span>
    </div>

    <div v-if="loading" class="flex-1 min-h-0 flex flex-col gap-3 animate-pulse">
      <div v-for="i in 3" :key="i" class="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 first:border-t-0 first:pt-0">
        <div class="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
        <div class="flex-1 flex flex-col gap-2">
          <div class="h-4 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div class="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    </div>

    <p v-else-if="activities.length === 0" class="text-sm text-zinc-500 py-2">No recent activity</p>

    <div v-else class="flex-1 min-h-0 overflow-y-auto flex flex-col">
      <div
        v-for="activity in activities.slice(0,8)"
        :key="activity.activityId"
        class="flex items-center gap-3 py-3 border-t border-zinc-100 dark:border-zinc-800 first:border-t-0 first:pt-0"
      >
        <span
          class="h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold"
          :class="getAvatarColor(activity.actorUserId)"
        >
          {{ initials(activity) }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-zinc-900 dark:text-zinc-100">
            <span class="font-semibold">{{ actorName(activity) }}</span>
            {{ activityText(activity) }}
          </p>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {{ formatRelativeTime(activity.createdAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
