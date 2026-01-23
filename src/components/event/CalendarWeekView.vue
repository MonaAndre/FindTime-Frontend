<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { GetAllGroupEventsResponse } from '@/types/events'
import ButtonComponent from '../reusables/ButtonComponent.vue'

const props = defineProps<{
  events: GetAllGroupEventsResponse[]
  groupId: number
}>()

const emits = defineEmits<{
  (e: 'eventClick', event: GetAllGroupEventsResponse): void
  (e: 'dateClick', date: Date): void
}>()

const currentDate = ref(new Date())

const weekDays = computed(() => {
  const days: Array<{
    date: Date
    isToday: boolean
    events: GetAllGroupEventsResponse[]
  }> = []

  const startOfWeek = new Date(currentDate.value)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)

  startOfWeek.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)

    days.push({
      date,
      isToday: isToday(date),
      events: getEventsForDate(date),
    })
  }

  return days
})

const weekRange = computed(() => {
  const start = weekDays.value[0]!.date
  const end = weekDays.value[6]!.date

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (start.getMonth() === end.getMonth()) {
    return `${formatDate(start)} - ${end.getDate()}, ${start.getFullYear()}`
  }
  return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`
})

const getEventsForDate = (date: Date): GetAllGroupEventsResponse[] => {
  return props.events.filter((event) => {
    const eventStart = new Date(event.startTime)
    return (
      eventStart.getDate() === date.getDate() &&
      eventStart.getMonth() === date.getMonth() &&
      eventStart.getFullYear() === date.getFullYear()
    )
  })
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const previousWeek = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 7)
  currentDate.value = newDate
}

const nextWeek = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 7)
  currentDate.value = newDate
}

const goToToday = () => {
  currentDate.value = new Date()
}

const getCategoryColorClasses = (color?: string) => {
  const colorMap: Record<string, string> = {
    zinc: 'bg-zinc-100 text-zinc-700 border-l-zinc-500 dark:bg-zinc-800 dark:text-zinc-200',
    pink: 'bg-pink-50 text-pink-700 border-l-pink-500 dark:bg-pink-900/30 dark:text-pink-200',
    red: 'bg-red-50 text-red-700 border-l-red-500 dark:bg-red-900/30 dark:text-red-200',
    blue: 'bg-blue-50 text-blue-700 border-l-blue-500 dark:bg-blue-900/30 dark:text-blue-200',
    green: 'bg-green-50 text-green-700 border-l-green-500 dark:bg-green-900/30 dark:text-green-200',
    orange: 'bg-orange-50 text-orange-700 border-l-orange-500 dark:bg-orange-900/30 dark:text-orange-200',
  }
  return colorMap[color || 'zinc'] || colorMap.zinc
}

const formatEventTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div class="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border 
    border-zinc-200 dark:border-zinc-800">
    <!-- Header -->
    <div class="p-4 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {{ weekRange }}
        </h2>
        <ButtonComponent secondary sm @click="goToToday">Today</ButtonComponent>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between">
        <button
          @click="previousWeek"
          class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <div class="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Week View
        </div>

        <button
          @click="nextWeek"
          class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronRightIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>

    <!-- Week Days -->
    <div class="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-800">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        @click="emits('dateClick', day.date)"
        :class="[
          'h-32 md:h-40 bg-white dark:bg-zinc-900 p-3 cursor-pointer hover:bg-zinc-50  dark:hover:bg-zinc-800 transition-colors flex flex-col',
          {
            'ring-2 ring-blue-500 ring-inset': day.isToday,
          },
        ]"
      >
        <!-- Day Header -->
        <div class="text-center mb-2 flex-shrink-0">
          <div class="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {{ dayNames[index] }}
          </div>
          <div
            :class="[
              'text-lg font-semibold mt-1',
              {
                'text-zinc-900 dark:text-zinc-100': !day.isToday,
                'text-blue-600 dark:text-blue-400': day.isToday,
              },
            ]"
          >
            {{ day.date.getDate() }}
          </div>
        </div>

        <!-- Events - Scrollable -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden space-y-1 min-h-0
          scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 
          scrollbar-track-transparent">
          <div
            v-for="event in day.events"
            :key="event.eventId"
            @click.stop="emits('eventClick', event)"
            :class="[
              'text-xs px-2 py-1.5 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow flex-shrink-0',
              getCategoryColorClasses(event.categoryColor!),
            ]"
          >
            <div class="font-medium truncate">{{ event.eventName }}</div>
            <div class="text-[10px] opacity-75 mt-0.5">
              {{ formatEventTime(event.startTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

