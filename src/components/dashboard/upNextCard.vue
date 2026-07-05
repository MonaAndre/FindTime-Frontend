<script setup lang="ts">
import { userGroupStore } from '@/stores/userGroupStore'
import type { GetAllEventsNextWeekDtoResponse } from '@/types/events'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { format, parseISO } from 'date-fns'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { ClockIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const eventStore = userGroupStore()
const { eventsNextWeek } = storeToRefs(eventStore)

const nextEvent = computed<GetAllEventsNextWeekDtoResponse | undefined>(
  () => eventsNextWeek.value[0],
)

const formatEventTime = (iso: string) => format(parseISO(iso), 'EEEE · HH:mm')

const now = ref(new Date())
let intervalId: ReturnType<typeof setInterval> | null = null

const countdown = computed(() => {
  if (!nextEvent.value?.startTime) return { days: 0, hours: 0, minutes: 0 }

  const diff = new Date(nextEvent.value.startTime).getTime() - now.value.getTime()

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  }
})

onMounted(async () => {
  await eventStore.fetchNextWeekEvents()
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <section
    class="flex flex-col w-1/2 gap-2 border p-4 border-blue-200 rounded-md bg-[linear-gradient(135deg,#0f0c08eb_0%,#142042_55%,#15171d_100%)]"
  >
    <div class="flex items-center gap-2">
      <span class="inline-block w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
      <p class="text-blue-300 text-xs font-bold">UP NEXT</p>
    </div>
    <div class="flex items-center gap-2">
      <span
        v-if="nextEvent?.categoryColor"
        class="inline-block w-2 h-2 rounded-full bg-blue-300 animate-pulse"
        >{{ nextEvent?.categoryColor }}</span
      >
      <p class="text-gray-300 text-sm">
        {{ nextEvent?.creatorUserEmail }}
      </p>
    </div>
    <div class="grid grid-cols-2">
      <div class="flex flex-col gap-1">

        
        <p class="text-3xl mt-2 font-extrabold tracking-tight">{{ nextEvent?.eventName }}</p>
        <div class="flex gap-1 items-center">
          <ClockIcon class="h-4 w-4" />
          <p class="text-sm">
            {{ nextEvent?.startTime ? formatEventTime(nextEvent.startTime) : '' }}
          </p>
          <MapPinIcon class="h-4 w-4 ml-3" />
          <p class="text-sm">{{ nextEvent?.location }}</p>
        </div>
      </div>
      <div class="flex-col">
        <div class="text-end">
          <p class="text-xs text-gray-300">starts in</p>
          <p class="text-3xl font-bold">{{ countdown.hours }}h {{ countdown.minutes }}m</p>

          <ButtonComponent margin-y primary sm class="p-2!">View event</ButtonComponent>
        </div>
      </div>
    </div>
  </section>
</template>
