<script setup lang="ts">
import type { GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import EventCard from './EventCard.vue'
import Drawer from 'primevue/drawer'

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
  <Drawer
    :visible="visible"
    @update:visible="emits('update:visible', $event)"
    position="right"
    block-scroll
    header="Event Details"
    class="w-full md:w-96"
  >
    <EventCard
      v-if="event"
      :event="event"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="handleUpdate"
    />
  </Drawer>
</template>
