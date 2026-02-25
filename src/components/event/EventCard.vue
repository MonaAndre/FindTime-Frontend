<script setup lang="ts">
import { RecurrencePattern, type GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import UpdateEvent from './UpdateEvent.vue'
import DeleteEvent from './DeleteEvent.vue'
import EventCategorySection from './EventCategorySection.vue'
import TextTag from '../reusables/TextTag.vue'
import { ArrowPathIcon, MapPinIcon, UserIcon } from '@heroicons/vue/24/outline'
import TimeLine from '../reusables/TimeLine.vue'

const props = defineProps<{
  event: GetAllGroupEventsResponse
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const mapRecurrencePattern = () => {
  if (props.event.recurrencePattern !== undefined) {
    return RecurrencePattern[props.event.recurrencePattern]
  }
  return ''
}
</script>

<template>
  <div class="flex p-1 rounded-xl flex-col gap-2 mb-5 text-zinc-900 dark:text-zinc-300">
    <TextTag v-if="event.categoryName" :color="event.categoryColor!">{{
      event.categoryName
    }}</TextTag>
    <p class="font-semibold text-xl">{{ event.eventName }}</p>

    <p class="flex gap-2 text-xs align-baseline">
      <span class="text-zinc-500 flex gap-1"><UserIcon class="w-4 h-4"></UserIcon> Created by </span
      ><span>{{ event.nickname ?? event.creatorUserName }}</span>
    </p>
       <p v-if="event.location" class="flex gap-2 text-xs align-baseline">
      <span class="text-zinc-500 flex gap-1"><MapPinIcon class="w-4 h-4"></MapPinIcon> Location: </span
      ><span>{{ event.location }}</span>
    </p>
    <p class="text-zinc-500 mt-5 mb-1 uppercase tracking-wide text-xs">Time & Schedule</p>
    <TimeLine :start-date="event.startTime" :end-date="event.endTime" />

    <p class="flex justify-between p-4 font-bold text-sm bg-zinc-200 dark:bg-zinc-700 rounded-lg">
      <span class="flex gap-1"><ArrowPathIcon class="w-4"></ArrowPathIcon> Recurring event:</span>
      <span class="font-medium">{{ event.isRecurring ? mapRecurrencePattern() : 'No' }}</span>
    </p>

    <p class="text-zinc-500 mt-5 mb-1 uppercase tracking-wide text-xs">Description</p>
    <span class="bg-zinc-200 dark:bg-zinc-700 rounded-lg p-4">
      <p v-if="event.eventDescription" class="text-sm">{{ event.eventDescription }}</p>
      <p v-else class="text-sm">No description</p>
    </span>

    <EventCategorySection
      :event="event"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="emits('update')"
    />

    <div class="flex flex-col gap-5">
      <UpdateEvent
        :group-categories="groupCategories"
        @update="emits('update')"
        :event-data="event"
      />
      <DeleteEvent @update="emits('update')" :event-id="event.eventId" />
    </div>
  </div>
</template>
