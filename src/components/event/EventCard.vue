<script setup lang="ts">
import { computed } from 'vue'
import { RecurrencePattern, type GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import UpdateEvent from './UpdateEvent.vue'
import DeleteEvent from './DeleteEvent.vue'
import EventCategorySection from './EventCategorySection.vue'
import { ArrowPathIcon, MapPinIcon, UserIcon } from '@heroicons/vue/24/outline'
import TimeLine from '../reusables/TimeLine.vue'
import RsvpSection from './RsvpSection.vue'

const props = defineProps<{
  event: GetAllGroupEventsResponse
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const recurrenceLabel = computed(() => {
  if (!props.event.isRecurring || props.event.recurrencePattern == null) return ''
  return RecurrencePattern[props.event.recurrencePattern]
})
</script>

<template>
  <div class="flex flex-col gap-5 text-zinc-900 dark:text-zinc-300">
    <div>
      <p class="text-xl font-bold">{{ event.eventName }}</p>
      <p
        class="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400"
      >
        <span class="flex items-center gap-1"
          ><UserIcon class="h-4 w-4" />{{ event.nickname ?? event.creatorUserName }}</span
        >
        <template v-if="event.location">
          <span>·</span>
          <span class="flex items-center gap-1"
            ><MapPinIcon class="h-4 w-4" />{{ event.location }}</span
          >
        </template>
        <template v-if="recurrenceLabel">
          <span>·</span>
          <span class="flex items-center gap-1"
            ><ArrowPathIcon class="h-4 w-4" />Repeats {{ recurrenceLabel }}</span
          >
        </template>
      </p>
    </div>

    <EventCategorySection
      :event="event"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="emits('update')"
    />

    <div>
      <p class="label-custom mb-2">Time & schedule</p>
      <TimeLine :start-date="event.startTime" :end-date="event.endTime" />
    </div>

    <div>
      <p class="label-custom mb-2">Description</p>
      <p
        v-if="event.eventDescription"
        class="border-l-2 border-zinc-200 pl-3 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
      >
        {{ event.eventDescription }}
      </p>
      <p v-else class="text-sm text-zinc-400 dark:text-zinc-500">No description added</p>
    </div>

    <div class="border-t border-zinc-200 pt-5 dark:border-zinc-700">
      <RsvpSection :event="event" @update="emits('update')" />
    </div>

    <div
      class="flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-700"
    >
      <DeleteEvent @update="emits('update')" :event-id="event.eventId" />
      <UpdateEvent :group-categories="groupCategories" @update="emits('update')" :event-data="event" />
    </div>
  </div>
</template>
