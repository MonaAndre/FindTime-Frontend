<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { GetAllGroupEventsResponse } from '@/types/events'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { getEventCategory } from '@/helpers/colors'

const props = defineProps<{
  events: GetAllGroupEventsResponse[]
  groupId: number
}>()

const emits = defineEmits<{
  (e: 'eventClick', event: GetAllGroupEventsResponse): void
  (e: 'dateClick', date: Date): void
  (e: 'rangeChange', start: Date, end: Date): void
}>()

const currentDate = ref(new Date())

watch(currentDate, (date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1
  const start = new Date(year, month, 1 - startDay)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 41)
  end.setHours(23, 59, 59, 999)
  emits('rangeChange', start, end)
}, { immediate: true })

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1

  const daysInMonth = lastDay.getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const days: Array<{
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    events: GetAllGroupEventsResponse[]
  }> = []

  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthDays - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date),
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      events: getEventsForDate(date),
    })
  }

  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      events: getEventsForDate(date),
    })
  }

  return days
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

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const formatEventTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
</script>

<template>
  <div
    class="w-full h-full flex flex-col bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800"
  >
    <!-- Calendar Header -->
    <div class="shrink-0 pt-4 px-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
      <!-- Navigation -->
      <div class="flex items-center">
        <button
          @click="previousMonth"
          class="p-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <div
          class="text-sm grow mr-2 font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-10"
        >
          <span class="grow text-center"> {{ monthNames[currentMonth] }} {{ currentYear }} </span>

          <ButtonComponent secondary sm @click="goToToday">Today</ButtonComponent>
        </div>

        <button
          @click="nextMonth"
          class="p-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronRightIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 min-h-0 flex flex-col p-4">
      <!-- Weekday Headers -->
      <div class="shrink-0 grid grid-cols-7 gap-px mb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="py-2 text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div
        class="flex-1 min-h-0 grid grid-cols-7 grid-rows-6 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden"
      >
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="emits('dateClick', day.date)"
          :class="[
            'min-h-0 bg-white dark:bg-zinc-900 p-2 cursor-pointer transition-colors relative flex flex-col',
            {
              'bg-zinc-50 dark:bg-zinc-800/50': !day.isCurrentMonth,
              'hover:bg-zinc-50 dark:hover:bg-zinc-800': day.isCurrentMonth,
              'ring-2 ring-blue-500 ring-inset': day.isToday,
            },
          ]"
        >
          <!-- Date Number -->
          <div class="flex items-start justify-between mb-1 flex-shrink-0">
            <span
              :class="[
                'text-xs font-medium inline-flex items-center justify-center w-7 h-7      rounded-full',
                {
                  'text-zinc-400 dark:text-zinc-600': !day.isCurrentMonth,
                  'text-zinc-900 dark:text-zinc-100': day.isCurrentMonth && !day.isToday,
                  'bg-blue-600 text-white': day.isToday,
                },
              ]"
            >
              {{ day.date.getDate() }}
            </span>
          </div>

          <div
            class="flex-1 overflow-y-auto overflow-x-hidden space-y-1 min-h-0 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-400 dark:hover:scrollbar-thumb-zinc-600"
          >
            <div
              v-for="event in day.events"
              :key="event.eventId"
              @click.stop="emits('eventClick', event)"
              :class="[
                'px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border-l-2 cursor-pointer hover:shadow-sm transition-shadow flex-shrink-0',
                getEventCategory(event.categoryColor!),
              ]"
            >
              <div class="text-[10px] sm:text-xs font-medium truncate">{{ event.eventName }}</div>
              <div class="hidden sm:block text-[10px] opacity-75">
                {{ formatEventTime(event.startTime) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
