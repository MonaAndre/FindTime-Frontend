<script setup lang="ts">
import type { GetAllEventsNextWeekDtoResponse } from '@/types/events'
import TimeLine from '../reusables/TimeLine.vue'
import { MapPinIcon, UserIcon } from '@heroicons/vue/24/outline'
import TextTag from '../reusables/TextTag.vue'

defineProps<{
  event: GetAllEventsNextWeekDtoResponse
}>()
</script>

<template>
  <div class="flex p-1 rounded-xl flex-col gap-2 mb-5 text-zinc-900 dark:text-zinc-300">
    <TextTag v-if="event.categoryName" :color="event.categoryColor!">{{
      event.categoryName
    }}</TextTag>
    <p class="font-semibold text-xl">{{ event.eventName }}</p>

    <p class="text-zinc-500 mt-2 uppercase tracking-wide text-xs">Group name</p>
    <span class="mb-3 text-sm">{{ event.groupName }}</span>

    <p class="flex gap-2 text-xs align-baseline">
      <span class="text-zinc-500 flex gap-1"><UserIcon class="w-4 h-4"></UserIcon> Created by </span
      ><span>{{ event.nickname ?? event.creatorUserName }}</span>
    </p>
    <p v-if="event.location" class="flex gap-2 text-xs align-baseline">
      <span class="text-zinc-500 flex gap-1"
        ><MapPinIcon class="w-4 h-4"></MapPinIcon> Location: </span
      ><span>{{ event.location }}</span>
    </p>
    <p class="text-zinc-500 mt-5 mb-1 uppercase tracking-wide text-xs">Time & Schedule</p>
    <TimeLine :start-date="event.startTime" :end-date="event.endTime" />

    <p class="text-zinc-500 mt-5 mb-1 uppercase tracking-wide text-xs">Description</p>
    <span class="bg-zinc-200 dark:bg-zinc-700 rounded-lg p-4">
      <p v-if="event.eventDescription" class="text-sm">{{ event.eventDescription }}</p>
      <p v-else class="text-sm">No description</p>
    </span>
  </div>
</template>
