<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AddEventDialog from '../event/AddEventDialog.vue'
import { BellIcon, PlusIcon } from '@heroicons/vue/24/outline'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import UpNextCard from './upNextCard.vue'
import WeekSummaryEventsCard from './WeekSummaryEventsCard.vue'
import { userGroupStore } from '@/stores/userGroupStore.ts'
import { storeToRefs } from 'pinia'
import type { GetAllEventsNextWeekDtoResponse } from '@/types/events.ts'
import GroupsOverview from './GroupsOverview.vue'

const showAddEventDialog = ref(false)

const eventStore = userGroupStore()
const { eventsNextWeek } = storeToRefs(eventStore)
const { groups } = storeToRefs(eventStore)

const nextEvent = computed<GetAllEventsNextWeekDtoResponse | undefined>(
  () => eventsNextWeek.value[0],
)

onMounted(async () => {
  await eventStore.fetchNextWeekEvents()
  if (groups.value.length === 0) {
    await eventStore.fetchGroups()
  }
})
</script>

<template>
  <!-- top bar -->
  <section
    class="flex justify-between items-center px-3 border-b dark:border-zinc-600 border-zinc-300 bg-white dark:bg-zinc-900"
  >
    <p class="font-bold text-lg">Dashboard</p>
    <div class="flex items-center divide-x divide-zinc-300 dark:divide-zinc-600 gap-5">
      <div class="flex justify-center">
        <BellIcon class="w-5 h-5 mr-5" />
      </div>
      <ButtonComponent end margin-y @click="showAddEventDialog = true" lg primary>
        <PlusIcon class="h-5 w-5 mr-1" />Create event
      </ButtonComponent>

      <AddEventDialog
        v-model:visible="showAddEventDialog"
        :without-group="true"
        @update="eventStore.fetchNextWeekEvents()"
      />
    </div>
  </section>
  <section class="grid grid-cols-12 p-4">
    <div class="col-span-8 flex flex-col gap-5">
      <UpNextCard :next-event="nextEvent" />
      <WeekSummaryEventsCard :events="eventsNextWeek" />
      <GroupsOverview :groups="groups" />
    </div>
  </section>
</template>
