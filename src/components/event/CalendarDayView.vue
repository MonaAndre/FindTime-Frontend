<script setup lang="ts">
import { computed, ref } from 'vue'
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
  (e: 'timeSlotClick', hour: number): void
}>()

const currentDate = ref(new Date())

const hours = Array.from({ length: 24 }, (_, i) => i)

const dayEvents = computed(() => {
  return props.events.filter((event) => {
    const eventStart = new Date(event.startTime)
    return (
      eventStart.getDate() === currentDate.value.getDate() &&
      eventStart.getMonth() === currentDate.value.getMonth() &&
      eventStart.getFullYear() === currentDate.value.getFullYear()
    )
  })
})

const getEventsForHour = (hour: number): GetAllGroupEventsResponse[] => {
  return dayEvents.value.filter((event) => {
    const eventStart = new Date(event.startTime)
    return eventStart.getHours() === hour
  })
}

const previousDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 1)
  currentDate.value = newDate
}

const nextDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 1)
  currentDate.value = newDate
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

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div
    class="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800"
  >
    <!-- Header -->
    <div class="p-4 border-b border-zinc-200 dark:border-zinc-800">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {{ formatDate(currentDate) }}
        </h2>
        <ButtonComponent secondary sm @click="goToToday">Today</ButtonComponent>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between">
        <button
          @click="previousDay"
          class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronLeftIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <div class="text-sm font-medium text-zinc-600 dark:text-zinc-400">Day View</div>

        <button
          @click="nextDay"
          class="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ChevronRightIcon class="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>

    <!-- Time Slots -->
    <div class="max-h-[600px] overflow-y-auto">
      <div
        v-for="hour in hours"
        :key="hour"
        @click="emits('timeSlotClick', hour)"
        class="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
      >
        <div class="flex">
          <!-- Time Label -->
          <div
            class="w-20 flex-shrink-0 p-3 text-sm font-medium text-zinc-500 dark:text-zinc-400 text-right border-r border-zinc-200 dark:border-zinc-800"
          >
            {{ hour.toString().padStart(2, '0') }}:00
          </div>

          <!-- Events Container -->
          <div class="flex-1 p-2 min-h-[60px]">
            <div class="space-y-1">
              <div
                v-for="event in getEventsForHour(hour)"
                :key="event.eventId"
                @click.stop="emits('eventClick', event)"
                :class="[
                  'text-xs px-3 py-2 rounded border-l-2 cursor-pointer hover:shadow-md transition-shadow',
                  getEventCategory(event.categoryColor!),
                ]"
              >
                <div class="font-semibold mb-1">{{ event.eventName }}</div>
                <div class="text-[11px] opacity-75">
                  {{ formatEventTime(event.startTime) }} - {{ formatEventTime(event.endTime) }}
                </div>
                <div v-if="event.location" class="text-[11px] opacity-75 mt-1">
                  📍 {{ event.location }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary -->
    <div
      class="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
    >
      <div class="text-sm text-zinc-600 dark:text-zinc-400">
        {{ dayEvents.length }} {{ dayEvents.length === 1 ? 'event' : 'events' }} today
      </div>
    </div>
  </div>
</template>
