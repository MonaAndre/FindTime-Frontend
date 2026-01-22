<script setup lang="ts">
import { eventApi } from '@/endpoints/eventEndpoints'
import { RecurrencePattern, type GetAllGroupEventsResponse } from '@/types/events'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import AddEvent from './AddEvent.vue'

const toast = useToast()
const props = defineProps<{
  groupId: number
}>()
const events = ref<GetAllGroupEventsResponse[]>([])

const getGroupEvents = async (groupId: number) => {
  try {
    const response = await eventApi.getGroupEvents(groupId)
    if (response.success) {
      events.value = response.data ?? []
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to get group events',
      life: 5000,
    })
    console.error(error)
  }
}
const mapRecurrencePattern = (eventId: number) => {
  const event = events.value.find(e => e.eventId === eventId)
  if (event && event.recurrencePattern !== undefined) {
    return RecurrencePattern[event.recurrencePattern]
  }
  return ''
}


const formatDate = (date: string) => new Date(date).toLocaleString()
onMounted(() => {
  getGroupEvents(props.groupId)
})

</script>

<template>

  <AddEvent @update="getGroupEvents(groupId)" :group-id="groupId" />
  <h1>Event list</h1>
  {{ groupId }}
  <ul>
    <li class="flex gap-3 mb-5" v-for="groupEvent in events" :key="groupEvent.eventId">
      <p>Created by {{ groupEvent.nickname ?? groupEvent.creatorUserName }}</p>
      <p>{{ groupEvent.eventName }}</p>
      <p>Start time {{ formatDate(groupEvent.startTime) }}</p>
      <p>End time {{ formatDate(groupEvent.endTime) }}</p>
      <p>Is reccuring {{ groupEvent.isRecurring ? 'Yes' : 'No' }}</p>
      <p v-if="groupEvent.isRecurring">{{ mapRecurrencePattern(groupEvent.eventId) }}</p>
      <p>{{ groupEvent.categoryColor }} </p>
    </li>
  </ul>
</template>
