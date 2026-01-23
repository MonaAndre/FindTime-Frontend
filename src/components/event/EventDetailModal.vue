<script setup lang="ts">
import Dialog from 'primevue/dialog'
import type { GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import EventCard from './EventCard.vue'

defineProps<{
  visible: boolean
  event: GetAllGroupEventsResponse | null
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
}>()

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update'): void
}>()

const handleUpdate = () => {
  emits('update')
  emits('update:visible', false)
}

</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emits('update:visible', $event)"
    modal
    header="Event Details"
    :style="{ width: '90vw', maxWidth: '600px' }"
  >
    <EventCard
      v-if="event"
      :event="event"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="handleUpdate"
    />
  </Dialog>
</template>