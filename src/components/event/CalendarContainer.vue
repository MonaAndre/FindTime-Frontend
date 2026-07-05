<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CalendarMonthView from './CalendarMonthView.vue'
import CalendarWeekView from './CalendarWeekView.vue'
import CalendarDayView from './CalendarDayView.vue'
import AddEventDialog from './AddEventDialog.vue'
import EventDetailModal from './EventDetailModal.vue'
import { eventApi } from '@/endpoints/eventEndpoints'
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
import { getDotColor } from '@/helpers/colors'
import NotificationBell from '../layout/NotificationBell.vue'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  events: GetAllGroupEventsResponse[]
  groupId: number
  groupName: string
  groupCategories: GroupCategoryGroupDto[]
  groupColor: string
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'openCategoryDrawer'): void
  (e: 'openGroupInfoDrawer'): void
  (e: 'rangeChange', start: Date, end: Date): void
}>()

type ViewMode = 'month' | 'week' | 'day'

const viewModes: { value: ViewMode; label: string; icon: typeof CalendarIcon }[] = [
  { value: 'month', label: 'Month', icon: CalendarIcon },
  { value: 'week', label: 'Week', icon: Squares2X2Icon },
  { value: 'day', label: 'Day', icon: QueueListIcon },
]

const route = useRoute()
const router = useRouter()
const toast = useToast()

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

const selectedCategoryOption = computed(() =>
  categoryFilterOptions.value.find((option) => option.categoryId === selectedCategoryFilter.value),
)

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

const handleRangeChange = (start: Date, end: Date) => {
  emits('rangeChange', start, end)
}

const handleTimeSlotClick = (hour: number) => {
  const date = new Date()
  date.setHours(hour, 0, 0, 0)
  selectedDate.value = date
  showAddEventDialog.value = true
}

// Watch rather than onMounted: clicking a second notification while already on
// this group's route only changes the query (no remount), so onMounted would
// miss it. A second click can also fire before the first click's fetch
// resolves — onCleanup marks the in-flight fetch stale so an out-of-order
// response can't overwrite the drawer with the wrong event.
watch(
  () => route.query.eventId,
  async (eventIdParam, _oldValue, onCleanup) => {
    if (!eventIdParam) return

    let cancelled = false
    onCleanup(() => {
      cancelled = true
    })

    try {
      const res = await eventApi.getEvent(props.groupId, Number(eventIdParam))
      if (cancelled) return

      if (res.success && res.data) {
        selectedEvent.value = res.data
        showEventDetail.value = true
      } else {
        toast.add({ severity: 'error', summary: 'Event not found', life: 3000 })
      }
    } catch {
      if (!cancelled) {
        toast.add({ severity: 'error', summary: 'Event not found', life: 3000 })
      }
    } finally {
      if (!cancelled && route.query.eventId === eventIdParam) {
        router.replace({ query: {} })
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full flex flex-col min-h-0">
    <!-- Top bar -->
    <section
      class="shrink-0 flex justify-between items-center px-3 py-3 border-b dark:border-zinc-600 border-zinc-300 bg-white dark:bg-zinc-900"
    >
      <p class="font-bold text-lg truncate min-w-0">{{ groupName }}</p>
      <div
        class="shrink-0 flex items-center divide-x divide-zinc-300 dark:divide-zinc-600 gap-3 sm:gap-6"
      >
        <div class="flex justify-center pr-2">
          <NotificationBell />
        </div>
        <ButtonComponent primary md @click="emits('openCategoryDrawer')"
          ><TagIcon class="w-5" />
          <p class="hidden ml-1 lg:block">Categories</p></ButtonComponent
        >
        <ButtonComponent primary md @click="emits('openGroupInfoDrawer')">
          <InformationCircleIcon class="w-5" />
          <p class="hidden ml-1 lg:block">Group Info</p></ButtonComponent
        >
        <ButtonComponent primary md @click="handleAddEvent">
          <span class="w-5"><PlusCircleIcon /></span>
          <span class="hidden ml-1 text-nowrap lg:inline">Add Event</span>
        </ButtonComponent>
      </div>
    </section>

    <!-- Toolbar -->
    <div
      class="shrink-0 flex items-center justify-between gap-3 bg-neutral-100 dark:bg-stone-900 px-3 py-3"
    >
      <!-- View Mode Selector -->
      <div
        class="shrink-0 inline-flex items-center gap-1 rounded-full bg-zinc-200 dark:bg-zinc-800 p-1"
      >
        <button
          v-for="mode in viewModes"
          :key="mode.value"
          type="button"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-colors"
          :class="
            viewMode === mode.value
              ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          "
          @click="viewMode = mode.value"
        >
          <component :is="mode.icon" class="h-4 w-4" />
          <span class="hidden sm:inline">{{ mode.label }}</span>
        </button>
      </div>
      <!-- Category Filter -->
      <div class="flex items-center gap-2 flex-1 min-w-0 sm:flex-initial relative">
        <FunnelIcon
          class="h-4 w-4 text-zinc-500 dark:text-zinc-400 absolute left-2 z-30 pointer-events-none"
        />
        <Select
          v-model="selectedCategoryFilter"
          :options="categoryFilterOptions"
          option-label="categoryName"
          option-value="categoryId"
          placeholder="Filter by category"
          size="small"
          class="w-full pl-5 sm:w-52 dark:bg-zinc-700!"
        >
          <template #value>
            <div class="flex items-center gap-2 min-w-0">
              <span
                class="w-2.5 h-2.5 rounded-full shrink-0"
                :class="getDotColor(selectedCategoryOption?.categoryColor)"
              ></span>
              <span class="truncate">{{ selectedCategoryOption?.categoryName }}</span>
            </div>
          </template>
          <template #option="slotProps">
            <div class="flex items-center gap-2">
              <span
                class="w-2.5 h-2.5 rounded-full shrink-0"
                :class="getDotColor(slotProps.option.categoryColor)"
              ></span>
              <span>{{ slotProps.option.categoryName }}</span>
            </div>
          </template>
        </Select>
      </div>
    </div>

    <!-- Calendar Views -->
    <div class="flex-1 min-h-0 overflow-hidden">
      <CalendarMonthView
        v-if="viewMode === 'month'"
        :events="filteredEvents"
        :group-id="groupId"
        @event-click="handleEventClick"
        @date-click="handleDateClick"
        @range-change="handleRangeChange"
      />

      <CalendarWeekView
        ref="calendarRef"
        v-else-if="viewMode === 'week'"
        :events="filteredEvents"
        :group-id="groupId"
        @event-click="handleEventClick"
        @date-click="handleDateClick"
        @range-change="handleRangeChange"
      />

      <CalendarDayView
        v-else
        :events="filteredEvents"
        :group-id="groupId"
        @event-click="handleEventClick"
        @time-slot-click="handleTimeSlotClick"
        @range-change="handleRangeChange"
      />
    </div>

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
