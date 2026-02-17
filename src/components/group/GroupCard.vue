<script setup lang="ts">
import type { Group } from '@/types/group'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useRouter } from 'vue-router'
import {  getBorderColors, getTextColors } from '@/helpers/colors'
import { CalendarDaysIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import type { NextEventDtoResponse } from '@/types/events'
import { eventApi } from '@/endpoints/eventEndpoints'
import {  onMounted, ref } from 'vue'

const router = useRouter()
const props = defineProps<Group>()
const goToGroupPage = () => {
  router.push({ name: 'group', params: { id: props.groupId } })
}
const nextEvent = ref<NextEventDtoResponse | null>(null);

const getNextEvent = async (groupId: number) => {
  try {
    const result = await eventApi.getNextEvent(groupId)
    if (result.success) {
      nextEvent.value = result.data
    }
  } catch (error) {
    console.error(error)
  }
}
const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
onMounted(() => {
  getNextEvent(props.groupId)
})
</script>
<template>
  <div
    :class="getBorderColors(props.groupColor)"
    class="p-5 rounded-xl border-2 flex flex-col space-y-3 bg-white dark:bg-zinc-700"
  >
    <div class="flex justify-between w-full">
      <h2 class="font-bold">{{ props.groupName }}</h2>
      <span v-if="props.isAdmin">
        <p class="border-2 py-.5 px-2 text-blue-600 text-sm border-blue-600 ml-auto rounded-full">
          Admin
        </p>
      </span>
    </div>
    <span class="inline-flex items-center gap-2 text-zinc-500 dark:text-zinc-200">
      <UserGroupIcon class="w-4 h-4" />
      <p class="text-sm">{{ props.memberCount }} members</p>
    </span>

    <section
      class="bg-neutral-100 dark:bg-zinc-900 py-3 px-3 border-l-5 space-y-3"
      :class="getBorderColors(nextEvent?.categoryColor!)"
    >
      <p class="text-xs font-bold" :class="getTextColors(nextEvent?.categoryColor!)">UPCOMING EVENT</p>
      <p class="font-bold text-zinc-600 dark:text-zinc-200">{{ nextEvent?.eventName ?? 'No upcoming events'  }}</p>
      <p v-if="nextEvent?.startTime" class="text-zinc-500 dark:text-zinc-200 text-xs">{{formatDate(nextEvent.startTime!)}}</p>
      <p v-else class="text-zinc-500 dark:text-zinc-200 text-xs">-</p>
    </section>
    <ButtonComponent md primary @click="goToGroupPage()">
      <CalendarDaysIcon class="w-5 h-5 mr-2" />Open Calendar
    </ButtonComponent>
  </div>
</template>
