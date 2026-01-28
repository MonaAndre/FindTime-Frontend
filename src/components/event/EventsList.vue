<script setup lang="ts">
import { eventApi } from '@/endpoints/eventEndpoints'
import type { GetAllGroupEventsResponse } from '@/types/events'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, watch } from 'vue'
import CalendarContainer from './CalendarContainer.vue'
import type { GroupCategoryGroupDto } from '@/types/group'

const toast = useToast()
const props = defineProps<{
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
}>()

const emits = defineEmits<{
  (e: 'openCategoryDrawer'): void
  (e: 'openGroupInfoDrawer'): void

}>()
const events = ref<GetAllGroupEventsResponse[]>([])
const isLoading = ref(false)

const getGroupEvents = async () => {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const response = await eventApi.getGroupEvents(props.groupId)
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
  } finally {
    isLoading.value = false
  }
}

watch(() => props.groupId, () => {
  getGroupEvents()
}, { immediate: false })

onMounted(() => {
  getGroupEvents()
})

// Handle event updates locally without bubbling to parent
const handleEventUpdate = async () => {
  await getGroupEvents()
}
</script>

<template>
  <div class="pb-6">
    <CalendarContainer v-if="!isLoading" :events="events" :group-id="groupId" :group-categories="groupCategories"
      @update="handleEventUpdate" @open-category-drawer="emits('openCategoryDrawer')"
      @open-group-info-drawer="emits('openGroupInfoDrawer')" />
    <div v-else class="text-center py-10">
      <p class="text-zinc-500">Loading calendar...</p>
    </div>
  </div>
</template>