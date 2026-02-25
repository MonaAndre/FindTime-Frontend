<script setup lang="ts">
import { computed, ref } from 'vue'
import CalendarMonthView from './CalendarMonthView.vue'
import CalendarWeekView from './CalendarWeekView.vue'
import CalendarDayView from './CalendarDayView.vue'
import AddEventDialog from './AddEventDialog.vue'
import EventDetailModal from './EventDetailModal.vue'
import type { GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import {
  CalendarIcon,
  Squares2X2Icon,
  QueueListIcon,
  FunnelIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  TagIcon,
} from '@heroicons/vue/24/outline'
import Select from 'primevue/select'

const props = defineProps<{
  events: GetAllGroupEventsResponse[]
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
  groupColor: string
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'openCategoryDrawer'): void
  (e: 'openGroupInfoDrawer'): void
}>()

type ViewMode = 'month' | 'week' | 'day'

const viewMode = ref<ViewMode>('month')
const showAddEventDialog = ref(false)
const selectedEvent = ref<GetAllGroupEventsResponse | null>(null)
const showEventDetail = ref(false)
const selectedDate = ref<Date | null>(null)
const selectedCategoryFilter = ref<number | null>(null)

const filteredEvents = computed(() => {
  if (selectedCategoryFilter.value === null) {
    return props.events
  }
  return props.events.filter((event) => event.categoryId === selectedCategoryFilter.value)
})

const categoryFilterOptions = computed(() => {
  return [
    { categoryId: null, categoryName: 'All Categories', categoryColor: 'zinc' },
    ...props.groupCategories,
  ]
})

const handleEventClick = (event: GetAllGroupEventsResponse) => {
  selectedEvent.value = event
  showEventDetail.value = true
}

const handleDateClick = (date: Date) => {
  selectedDate.value = date
  showAddEventDialog.value = true
}

const handleAddEvent = () => {
  selectedDate.value = null
  showAddEventDialog.value = true
}

const handleEventUpdate = async () => {
  emits('update')
  showEventDetail.value = false
  showAddEventDialog.value = false
}

const handleTimeSlotClick = (hour: number) => {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  selectedDate.value = date
  showAddEventDialog.value = true
}
</script>

<template>
  <div class="space-y-4 pt-2">
    <!-- Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-3">
      <!-- View Mode Selector -->

      <div class="flex items-center gap-1 rounded-lg p-1">
        <ButtonComponent
          :primary="viewMode === 'month'"
          :tertiary="viewMode !== 'month'"
          sm
          @click="viewMode = 'month'"
        >
          <CalendarIcon class="h-4 w-4" />
          <span class="hidden sm:inline">Month</span>
        </ButtonComponent>
        <ButtonComponent
          :primary="viewMode === 'week'"
          :tertiary="viewMode !== 'week'"
          sm
          @click="viewMode = 'week'"
        >
          <Squares2X2Icon class="h-4 w-4" />
          <span class="hidden sm:inline">Week</span>
        </ButtonComponent>
        <ButtonComponent
          :primary="viewMode === 'day'"
          :tertiary="viewMode !== 'day'"
          sm
          @click="viewMode = 'day'"
        >
          <QueueListIcon class="h-4 w-4" />
          <span class="hidden sm:inline">Day</span>
        </ButtonComponent>
      </div>
      <section class="flex gap-2">
        <ButtonComponent primary md @click="emits('openCategoryDrawer')"
          ><TagIcon class="w-5" />
          <p class="hidden ml-1 lg:block">Categories</p></ButtonComponent
        >
        <ButtonComponent primary md @click="emits('openGroupInfoDrawer')">
          <InformationCircleIcon class="w-5" />
          <p class="hidden ml-1 lg:block">Group Info</p></ButtonComponent
        >
      </section>

      <!-- Category Filter & Add Event -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="flex items-center gap-2 flex-1 sm:flex-initial relative">
          <FunnelIcon class="h-4 w-4 text-zinc-500 dark:text-zinc-400 absolute left-2 z-30" />
          <Select
            v-model="selectedCategoryFilter"
            :options="categoryFilterOptions"
            option-label="categoryName"
            option-value="categoryId"
            placeholder="Filter by category"
            size="small"
            class="w-full pl-5 sm:w-48 dark:bg-zinc-700!"
          />
        </div>
        <ButtonComponent primary md @click="handleAddEvent">
          <span class="w-5"><PlusCircleIcon /></span>
          <span class="hidden ml-1 lg:inline">Add Event</span>
        </ButtonComponent>
      </div>
    </div>

    <!-- Calendar Views -->
    <CalendarMonthView
      v-if="viewMode === 'month'"
      :events="filteredEvents"
      :group-id="groupId"
      @event-click="handleEventClick"
      @date-click="handleDateClick"
    />

    <CalendarWeekView
      ref="calendarRef"
      v-else-if="viewMode === 'week'"
      :events="filteredEvents"
      :group-id="groupId"
      @event-click="handleEventClick"
      @date-click="handleDateClick"
    />

    <CalendarDayView
      v-else
      :events="filteredEvents"
      :group-id="groupId"
      @event-click="handleEventClick"
      @time-slot-click="handleTimeSlotClick"
    />

    <!-- Add Event Dialog -->
    <AddEventDialog
      v-model:visible="showAddEventDialog"
      :group-id="groupId"
      :group-categories="groupCategories"
      :initial-date="selectedDate"
      @update="handleEventUpdate"
    />

    <!-- Event Detail Modal -->
    <EventDetailModal
      v-model:visible="showEventDetail"
      :event="selectedEvent"
      :group-id="groupId"
      :group-categories="groupCategories"
      @update="handleEventUpdate"
    />
  </div>
</template>
