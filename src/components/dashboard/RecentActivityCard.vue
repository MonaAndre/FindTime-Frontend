<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { ActivityType, type ActivityDtoResponse } from '@/types/activity'
import { getAvatarColor } from '@/helpers/colors'
import { formatRelativeTime } from '@/helpers/time'

defineProps<{
  activities: ActivityDtoResponse[]
  loading?: boolean
}>()

const authStore = useAuthStore()

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
    v-if="loading"
    class="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent p-4 flex flex-col gap-3 animate-pulse"
  >
    <div class="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
    <div v-for="i in 3" :key="i" class="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
      <div class="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
      <div class="flex-1 flex flex-col gap-2">
        <div class="h-4 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
        <div class="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  </div>

  <div
    v-else
    class="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent p-4 flex flex-col gap-3"
  >
    <h2 class="font-bold text-zinc-900 dark:text-white text-lg">Recent activity</h2>

    <p v-if="activities.length === 0" class="text-sm text-zinc-500 py-2">No recent activity</p>

    <div
      v-for="activity in activities"
      :key="activity.activityId"
      class="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 first:border-t-0 first:pt-0"
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
</template>
