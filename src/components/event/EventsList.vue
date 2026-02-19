<script setup lang="ts">
import CalendarContainer from './CalendarContainer.vue'
import { getBgColors } from '@/helpers/colors'
import { userGroupStore } from '@/stores/userGroupStore'

const groupStore = userGroupStore()

const emits = defineEmits<{
  (e: 'openCategoryDrawer'): void
  (e: 'openGroupInfoDrawer'): void
}>()

const handleEventUpdate = async () => {
  await groupStore.fetchEvents()
}
</script>

<template>
  <div  :class="getBgColors(groupStore.currentGroup?.userGroupColor || 'zinc')">
    <CalendarContainer
      v-if="!groupStore.isLoading"
      :events="groupStore.eventsWithCurrentCategories"
      :group-id="groupStore.groupId || 0"
      :group-categories="groupStore.categories"
      :group-color="groupStore.currentGroup?.userGroupColor || 'zinc'"
      @update="handleEventUpdate"
      @open-category-drawer="emits('openCategoryDrawer')"
      @open-group-info-drawer="emits('openGroupInfoDrawer')"
    />
    <div v-else class="text-center py-10">
      <p class="text-zinc-500">Loading calendar...</p>
    </div>
  </div>
</template>
