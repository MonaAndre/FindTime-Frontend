<script setup lang="ts">
import type { GetAllEventsNextWeekDtoResponse } from '@/types/events'

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { format, parseISO } from 'date-fns'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { ClockIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import NextEventDetails from './NextEventDetails.vue'
import Drawer from 'primevue/drawer'

const color = ref<string>()
const showEventDetail = ref(false)

const props = defineProps<{
  nextEvent: GetAllEventsNextWeekDtoResponse | undefined
  loading?: boolean
}>()

const formatEventTime = (iso: string) => format(parseISO(iso), 'EEEE · HH:mm')

const now = ref(new Date())
let intervalId: ReturnType<typeof setInterval> | null = null

const countdown = computed(() => {
  if (!props.nextEvent?.startTime) return { days: 0, hours: 0, minutes: 0 }

  const diff = new Date(props.nextEvent.startTime).getTime() - now.value.getTime()

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  }
})

onMounted(async () => {
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)
  if (props.nextEvent?.categoryColor) {
    color.value = props.nextEvent?.categoryColor
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <section
    class="flex flex-col w-full gap-2 border p-4 border-blue-800 rounded-xl bg-[linear-gradient(135deg,#0f0c08eb_0%,#142042_55%,#15171d_100%)]"
  >
    <div class="flex items-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
      <p class="text-blue-300 text-xs font-bold">UP NEXT</p>
    </div>

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="animate-pulse flex flex-col gap-2">
        <div class="h-4 w-24 bg-blue-900/50 rounded" />
        <div class="h-8 w-48 bg-blue-900/50 rounded mt-1" />
        <div class="h-4 w-36 bg-blue-900/50 rounded" />
      </div>
    </template>

    <!-- No event -->
    <template v-else-if="!nextEvent">
      <p class="text-gray-400 text-sm italic mt-2">No upcoming events this week</p>
    </template>

    <!-- Event content -->
    <template v-else>
      <div class="flex items-center gap-2">
        <span
          class="inline-block w-2 h-2 rounded-xs"
          :class="nextEvent.categoryColor ? `bg-${color}-200` : 'bg-zinc-200'"
        ></span>
        <p class="text-gray-300 text-sm">{{ nextEvent.groupName }}</p>
      </div>
      <div class="grid grid-cols-2">
        <div class="flex flex-col gap-1">
          <p class="text-3xl mt-2 font-extrabold tracking-tight">{{ nextEvent.eventName }}</p>
          <div class="flex gap-1 items-center mt-1">
            <ClockIcon class="h-4 w-4" />
            <p class="text-sm">{{ formatEventTime(nextEvent.startTime) }}</p>
            <MapPinIcon class="h-4 w-4 ml-3" />
            <p class="text-sm">{{ nextEvent.location }}</p>
          </div>
        </div>
        <div class="flex-col">
          <div class="text-end">
            <p class="text-xs text-gray-300">starts in</p>
            <p class="text-3xl font-bold">{{ countdown.hours }}h {{ countdown.minutes }}m</p>
            <ButtonComponent margin-y primary sm class="p-2!" @click="showEventDetail = true">
              View event
            </ButtonComponent>
          </div>
        </div>
      </div>
    </template>
  </section>

  <Drawer
    v-model:visible="showEventDetail"
    position="right"
    block-scroll
    header="Event Details"
    class="w-full md:w-96"
  >
    <NextEventDetails v-if="nextEvent" :event="nextEvent" />
  </Drawer>
</template>
