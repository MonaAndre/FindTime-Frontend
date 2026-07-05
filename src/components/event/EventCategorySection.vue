<script setup lang="ts">
import type { GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import type { AddCategoryToEventDtoRequest } from '@/types/category'
import AddCategoryToEvent from '../category/AddCategoryToEvent.vue'
import { categoryApi } from '@/endpoints/categoryEndpoints'
import { useToast } from 'primevue/usetoast'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import TextTag from '../reusables/TextTag.vue'

const showSelectCategory = ref(false)
const toast = useToast()

const props = defineProps<{
  event: GetAllGroupEventsResponse
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const handleAddCatToEvent = async (categoryId: number) => {
  const req: AddCategoryToEventDtoRequest = {
    groupId: props.groupId,
    eventId: props.event.eventId,
    categoryId: categoryId,
  }

  try {
    const result = await categoryApi.addCategoryToEvent(req)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Category added to event',
        life: 5000,
      })
      showSelectCategory.value = false
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to add category',
      life: 5000,
    })
    console.error(error)
  }
}
</script>

<template>
  <div v-if="event.categoryId && event.categoryColor && !showSelectCategory">
    <p class="label-custom mb-2">Category</p>
    <TextTag
      class="cursor-pointer"
      @click="showSelectCategory = true"
      :icon="PencilSquareIcon"
      :color="event.categoryColor"
    >
      {{ event.categoryName }}</TextTag
    >
  </div>
  <div v-else-if="showSelectCategory || !event.categoryId">
    <p class="label-custom mb-2">Category</p>
    <AddCategoryToEvent
      @set-category-to-event="handleAddCatToEvent"
      :group-categories="groupCategories"
    />
  </div>
</template>
