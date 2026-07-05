<script setup lang="ts">
import { computed, ref } from 'vue'
import { userGroupStore } from '@/stores/userGroupStore'
import { storeToRefs } from 'pinia'
import { RsvpStatus, type GetAllEventsNextWeekDtoResponse } from '@/types/events'
import { eventApi } from '@/endpoints/eventEndpoints'
import { useToast } from 'primevue/usetoast'

defineProps<{
  loading?: boolean
}>()

const store = userGroupStore()
const { eventsNextWeek } = storeToRefs(store)
const toast = useToast()

const responding = ref<number | null>(null)

const pendingEvents = computed(() =>
  eventsNextWeek.value
    .filter((e) => e.myRsvpStatus === RsvpStatus.Pending || e.myRsvpStatus == null)
    .slice(0, 3),
)

const statusMessages: Record<RsvpStatus, string> = {
  [RsvpStatus.Accepted]: "You're going!",
  [RsvpStatus.Declined]: 'Not going — response saved',
  [RsvpStatus.Maybe]: 'Marked as maybe',
  [RsvpStatus.Pending]: 'Response cleared',
}

const respond = async (event: GetAllEventsNextWeekDtoResponse, status: RsvpStatus) => {
  if (responding.value === event.eventId) return
  responding.value = event.eventId
  try {
    const res = await eventApi.respondToEvent({ eventId: event.eventId, status })
    if (res.success) {
      toast.add({ severity: 'success', summary: statusMessages[status], life: 2500 })
      event.myRsvpStatus = status
      await store.fetchNextWeekEvents()
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Failed to respond', life: 3000 })
  } finally {
    responding.value = null
  }
}

const formatEventTime = (event: GetAllEventsNextWeekDtoResponse): string => {
  const date = new Date(event.startTime)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dayStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return `${dayStr} · ${time}`
}
</script>

<template>
  <div v-if="loading" class="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent p-4 flex flex-col gap-3 animate-pulse">
    <div class="h-5 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
    <div v-for="i in 2" :key="i" class="flex flex-col gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
      <div class="h-4 w-36 bg-zinc-200 dark:bg-zinc-700 rounded" />
      <div class="h-3 w-48 bg-zinc-100 dark:bg-zinc-800 rounded" />
      <div class="flex gap-2 mt-1">
        <div class="flex-1 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div class="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
        <div class="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
      </div>
    </div>
  </div>

  <div v-else-if="pendingEvents.length" class="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-transparent p-4 flex flex-col gap-3">
    <h2 class="font-bold text-zinc-900 dark:text-white text-lg">Needs your response</h2>

    <div
      v-for="event in pendingEvents"
      :key="event.eventId"
      class="flex flex-col gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 first:border-t-0 first:pt-0"
    >
      <div>
        <p class="font-semibold text-zinc-900 dark:text-white text-sm">{{ event.eventName }}</p>
        <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          {{ formatEventTime(event) }}
          <span v-if="event.groupName"> · {{ event.groupName }}</span>
        </p>
      </div>

      <div class="flex gap-2">
        <button
          class="flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors"
          :class="
            responding === event.eventId
              ? 'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-500 text-white'
          "
          :disabled="responding === event.eventId"
          @click="respond(event, RsvpStatus.Accepted)"
        >
          Going
        </button>
        <button
          class="flex-1 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
          :class="
            responding === event.eventId
              ? 'border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500 cursor-not-allowed'
              : 'border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          "
          :disabled="responding === event.eventId"
          @click="respond(event, RsvpStatus.Maybe)"
        >
          Maybe
        </button>
        <button
          class="flex-1 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
          :class="
            responding === event.eventId
              ? 'border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500 cursor-not-allowed'
              : 'border-zinc-300 text-zinc-700 dark:border-zinc-600 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700'
          "
          :disabled="responding === event.eventId"
          @click="respond(event, RsvpStatus.Declined)"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>
