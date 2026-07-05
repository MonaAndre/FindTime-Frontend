<script setup lang="ts">
import CalendarContainer from './CalendarContainer.vue'
import CalendarSkeleton from './CalendarSkeleton.vue'
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

const handleRangeChange = async (start: Date, end: Date) => {
  groupStore.setRange(start, end)
  await groupStore.fetchEvents()
}
</script>

<template>
  <div class="h-full flex flex-col min-h-0" :class="getBgColors(groupStore.currentGroup?.userGroupColor || 'zinc')">
    <CalendarContainer
      v-if="!groupStore.isLoading"
      :events="groupStore.eventsWithCurrentCategories"
      :group-id="groupStore.groupId || 0"
      :group-name="groupStore.currentGroup?.groupName || ''"
      :group-categories="groupStore.categories"
      :group-color="groupStore.currentGroup?.userGroupColor || 'zinc'"
      @update="handleEventUpdate"
      @range-change="handleRangeChange"
      @open-category-drawer="emits('openCategoryDrawer')"
      @open-group-info-drawer="emits('openGroupInfoDrawer')"
    />
    <CalendarSkeleton v-else />
  </div>
</template>
