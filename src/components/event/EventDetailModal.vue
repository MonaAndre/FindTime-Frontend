<script setup lang="ts">
import { eventApi } from '@/endpoints/eventEndpoints'
import type { GetAllGroupEventsResponse } from '@/types/events'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'
import CalendarContainer from './CalendarContainer.vue'
import type { GroupCategoryGroupDto } from '@/types/group'

const toast = useToast()
const props = defineProps<{
  groupId: number
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
  <div class="pb-6">
    <CalendarContainer
      :events="events"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="getGroupEvents(groupId)"
    />
  </div>
</template>