<script setup lang="ts">
import { RecurrencePattern, type GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import UpdateEvent from './UpdateEvent.vue'
import DeleteEvent from './DeleteEvent.vue'
import EventCategorySection from './EventCategorySection.vue'

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

const formatDate = (date: string) => new Date(date).toLocaleString()
</script>

<template>
  <li class="flex p-2 rounded-xl flex-col gap-2 border mb-5">
    <p>Created by {{ event.nickname ?? event.creatorUserName }}</p>
    <p class="font-semibold">{{ event.eventName }}</p>
    <p>Start time {{ formatDate(event.startTime) }}</p>
    <p>End time {{ formatDate(event.endTime) }}</p>
    <p>Is recurring {{ event.isRecurring ? 'Yes' : 'No' }}</p>
    <p v-if="event.isRecurring">{{ mapRecurrencePattern() }}</p>
    
    <EventCategorySection
      :event="event"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="emits('update')"
    />

    <div class="flex gap-2">
      <UpdateEvent 
        :group-categories="groupCategories" 
        @update="emits('update')"
        :event-data="event" 
      />
      <DeleteEvent 
        @update="emits('update')" 
        :event-id="event.eventId" 
      />
    </div>
  </li>
</template>