<script setup lang="ts">
import { computed } from 'vue'
import type { GetAllEventsNextWeekDtoResponse } from '@/types/events'
import { getEventCategory } from '@/helpers/colors'

const props = defineProps<{
  events: GetAllEventsNextWeekDtoResponse[]
}>()

const weekDays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return date
  })
})

const totalEvents = computed(() => props.events.length)

const uniqueCalendars = computed(() => new Set(props.events.map((e) => e.groupName)).size)

const getEventsForDay = (date: Date): GetAllEventsNextWeekDtoResponse[] => {
  return props.events
    .filter((event) => {
      const d = new Date(event.startTime)
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      )
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
}

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const dayAbbrev = (date: Date) =>
  date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
</script>

<template>
  <div class="rounded-xl bg-zinc-900 p-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="font-bold text-white text-lg">This week</h2>
      <span class="text-zinc-400 text-sm">
        {{ totalEvents }} event{{ totalEvents !== 1 ? 's' : '' }} across {{ uniqueCalendars }}
        calendar{{ uniqueCalendars !== 1 ? 's' : '' }}
      </span>
    </div>

    <div
      v-for="day in weekDays"
      :key="day.toISOString()"
      class="flex gap-4 py-2.5 border-t border-zinc-800"
    >
      <div class="w-10 shrink-0 text-center pt-0.5">
        <p class="text-xs font-semibold text-indigo-400 leading-none mb-0.5">{{ dayAbbrev(day) }}</p>
        <p class="text-xl font-bold text-white leading-none">{{ day.getDate() }}</p>
      </div>

      <div class="flex-1 flex flex-col gap-1.5 justify-center min-w-0">
        <template v-if="getEventsForDay(day).length">
          <div
            v-for="event in getEventsForDay(day)"
            :key="event.eventId"
            class="flex items-center justify-between px-3 py-2 rounded border-l-4 text-sm"
            :class="getEventCategory(event.categoryColor ?? undefined)"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span class="tabular-nums shrink-0 text-zinc-400">{{ formatTime(event.startTime) }}</span>
              <span class="font-semibold truncate">{{ event.eventName }}</span>
            </div>
            <span class="text-zinc-400 text-xs shrink-0 ml-4">{{ event.groupName }}</span>
          </div>
        </template>
        <p v-else class="text-zinc-500 italic text-sm">No plans — free</p>
      </div>
    </div>
  </div>
</template>
