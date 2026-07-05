<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import AddEventDialog from '../event/AddEventDialog.vue'
import { userGroupStore } from '@/stores/userGroupStore'
import { storeToRefs } from 'pinia'
import { eventApi } from '@/endpoints/eventEndpoints'

const store = userGroupStore()
const { eventsNextWeek, groups } = storeToRefs(store)

const selectedGroupId = ref<number | undefined>(groups.value[0]?.groupId)
const showCreateDialog = ref(false)
const showGroupDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const freeSlot = ref<{ start: string; end: string } | null>(null)
const loading = ref(false)

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showGroupDropdown.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

const selectGroup = (id: number) => {
  selectedGroupId.value = id
  showGroupDropdown.value = false
}

const fetchFreeSlot = async (groupId: number) => {
  loading.value = true
  freeSlot.value = null
  try {
    const res = await eventApi.findFreeSlot(groupId)
    if (res.success && res.data) {
      freeSlot.value = { start: res.data.startTime, end: res.data.endTime }
    }
  } catch {
    freeSlot.value = null
  } finally {
    loading.value = false
  }
}

// keep selection valid if groups load after mount, then fetch
watch(groups, (g) => {
  if (!selectedGroupId.value && g.length) selectedGroupId.value = g[0]!.groupId
}, { immediate: true })

watch(selectedGroupId, (id) => {
  if (id) fetchFreeSlot(id)
}, { immediate: true })

const selectedGroup = computed(() =>
  groups.value.find((g) => g.groupId === selectedGroupId.value),
)

const weekDays = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return date
  })
})

const hasEventsOnDay = (date: Date): boolean =>
  eventsNextWeek.value.some((e) => {
    if (selectedGroup.value && e.groupName !== selectedGroup.value.groupName) return false
    const d = new Date(e.startTime)
    return (
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    )
  })

const isSuggestedDay = (date: Date): boolean => {
  if (!freeSlot.value) return false
  const slot = new Date(freeSlot.value.start)
  return (
    slot.getDate() === date.getDate() &&
    slot.getMonth() === date.getMonth() &&
    slot.getFullYear() === date.getFullYear()
  )
}

const getDayColor = (date: Date): string => {
  if (isSuggestedDay(date)) return 'bg-teal-500 ring-2 ring-teal-300'
  if (hasEventsOnDay(date)) return 'bg-amber-700'
  return 'bg-zinc-700'
}

const getTimeOfDay = (dateString: string): string => {
  const hour = new Date(dateString).getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

const formatSlotDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

const formatTime = (dateString: string): string =>
  new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const dayNarrow = (date: Date): string =>
  date.toLocaleDateString('en-US', { weekday: 'narrow' })

const slotInitialDate = computed(() =>
  freeSlot.value ? new Date(freeSlot.value.start) : null,
)

const slotEndDate = computed(() =>
  freeSlot.value ? new Date(freeSlot.value.end) : null,
)
</script>

<template>
  <div class="rounded-xl bg-zinc-900 p-4 flex flex-col gap-4">
    <!-- Header -->
    <div>
      <div class="flex items-center gap-2 mb-1">
        <MagnifyingGlassIcon class="w-5 h-5 text-teal-400 shrink-0" />
        <h2 class="font-bold text-white text-lg">Find a time</h2>
      </div>
      <p class="text-sm text-zinc-400 flex items-center flex-wrap gap-x-1">
        Next slot everyone in
        <span class="relative" ref="dropdownRef">
          <button
            class="inline-flex items-center gap-0.5 font-semibold text-white hover:text-teal-300 transition-colors"
            @click="showGroupDropdown = !showGroupDropdown"
          >
            {{ selectedGroup?.groupName ?? '…' }}
            <ChevronDownIcon
              class="w-3.5 h-3.5 transition-transform"
              :class="showGroupDropdown ? 'rotate-180' : ''"
            />
          </button>
          <ul
            v-if="showGroupDropdown"
            class="absolute left-0 top-full mt-1 z-20 min-w-40 rounded-lg bg-zinc-800 border border-zinc-700 shadow-lg py-1 overflow-hidden"
          >
            <li
              v-for="group in groups"
              :key="group.groupId"
              class="px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700 cursor-pointer flex items-center justify-between gap-3"
              :class="group.groupId === selectedGroupId ? 'text-teal-400 font-semibold' : ''"
              @click="selectGroup(group.groupId)"
            >
              {{ group.groupName }}
            </li>
          </ul>
        </span>
        is free
      </p>
    </div>

    <!-- Slot card -->
    <div class="rounded-lg bg-teal-950 border border-teal-800 p-4 min-h-16">
      <template v-if="loading">
        <div class="h-5 w-40 bg-teal-900 rounded animate-pulse mb-2" />
        <div class="h-4 w-28 bg-teal-900 rounded animate-pulse" />
      </template>
      <template v-else-if="freeSlot">
        <p class="font-bold text-white text-lg leading-snug">
          {{ formatSlotDate(freeSlot.start) }} · {{ getTimeOfDay(freeSlot.start) }}
        </p>
        <p class="text-sm text-teal-300">
          {{ formatTime(freeSlot.start) }} – {{ formatTime(freeSlot.end) }} · all members free
        </p>
      </template>
      <p v-else class="text-sm text-zinc-500 italic">No free slot found in the next week</p>
    </div>

    <!-- Week strip -->
    <div class="flex justify-between">
      <div
        v-for="day in weekDays"
        :key="day.toISOString()"
        class="flex flex-col items-center gap-1"
      >
        <span class="text-xs text-zinc-500">{{ dayNarrow(day) }}</span>
        <div class="w-8 h-8 rounded-md transition-colors" :class="getDayColor(day)" />
      </div>
    </div>

    <!-- Create event -->
    <ButtonComponent
      primary
      lg
      :disabled="!freeSlot"
      class="w-full justify-center"
      @click="showCreateDialog = true"
    >
      Create event
    </ButtonComponent>

    <AddEventDialog
      v-model:visible="showCreateDialog"
      :group-id="selectedGroupId"
      :group-categories="selectedGroup ? [] : []"
      :initial-date="slotInitialDate"
      :initial-end-date="slotEndDate"
      @update="showCreateDialog = false"
    />
  </div>
</template>
