<script setup lang="ts">
import type { GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import type { AddCategoryToEventDtoRequest } from '@/types/category'
import AddCategoryToEvent from '../category/AddCategoryToEvent.vue'
import { categoryApi } from '@/endpoints/categoryEndpoints'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps<{
  event: GetAllGroupEventsResponse
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const bgClass = (color?: string) => {
  const colorMap: Record<string, string> = {
    zinc: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200 border border-zinc-700 rounded-xl p-2 inline',
    pink: 'bg-pink-200 text-pink-700 dark:bg-pink-600 dark:text-pink-200 border border-pink-700 rounded-xl p-2 inline',
    red: 'bg-red-200 text-red-700 dark:bg-red-600 dark:text-red-200 border border-red-700 rounded-xl p-2 inline',
    blue: 'bg-blue-200 text-blue-700 dark:bg-blue-600 dark:text-blue-200 border border-blue-700 rounded-xl p-2 inline',
    green: 'bg-green-200 text-green-700 dark:bg-green-600 dark:text-green-200 border border-green-700 rounded-xl p-2 inline',
    orange: 'bg-orange-200 text-orange-700 dark:bg-orange-600 dark:text-orange-200 border border-orange-700 rounded-xl p-2 inline',
  }
  return colorMap[color || 'red'] || 'bg-red-500 dark:bg-zinc-500'
}

const handleAddCatToEvent = async (categoryId: number) => {
  const req: AddCategoryToEventDtoRequest = {
    groupId: props.groupId,
    eventId: props.event.eventId,
    categoryId: categoryId
  }

  try {
    const result = await categoryApi.addCategoryToEvent(req)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Category added to event',
        life: 5000
      })
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to add category',
      life: 5000
    })
    console.error(error)
  }
}
</script>

<template>
  <div v-if="event.categoryId && event.categoryColor" class="my-5">
    <strong :class="bgClass(event.categoryColor)">
      {{ event.categoryName }}
    </strong>
  </div>
  <div v-else>
    <span class="text-sm text-gray-500">Add category</span>
    <AddCategoryToEvent 
      @set-category-to-event="handleAddCatToEvent" 
      :group-categories="groupCategories" 
    />
  </div>
</template>