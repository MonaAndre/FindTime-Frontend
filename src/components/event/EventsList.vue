<script setup lang="ts">
import { eventApi } from '@/endpoints/eventEndpoints'
import type { GetAllGroupEventsResponse } from '@/types/events'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import AddEvent from './AddEvent.vue'
import EventCard from './EventCard.vue'
import type { GroupCategoryGroupDto } from '@/types/group'

const toast = useToast()
const props = defineProps<{
  groupId: number,
  groupCategories: GroupCategoryGroupDto[]
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

onMounted(() => {
  getGroupEvents(props.groupId)
})
</script>

<template>
  <AddEvent 
    :group-categories="props.groupCategories" 
    @update="getGroupEvents(groupId)" 
    :group-id="groupId" 
  />
  
  <h3 class="text-center font-bold my-5">Event list:</h3>

  <ul class="grid grid-cols-2 gap-2">
    <EventCard
      v-for="groupEvent in events"
      :key="groupEvent.eventId"
      :event="groupEvent"
      :group-id="groupId"
      :group-categories="props.groupCategories"
      @update="getGroupEvents(groupId)"
    />
  </ul>
</template>