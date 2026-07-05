<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CheckIcon, ClockIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'primevue/usetoast'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { eventApi } from '@/endpoints/eventEndpoints'
import {
  RsvpStatus,
  type EventParticipantDtoResponse,
  type GetAllGroupEventsResponse,
} from '@/types/events'

const props = defineProps<{
  event: GetAllGroupEventsResponse
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const toast = useToast()
const participants = ref<EventParticipantDtoResponse[]>([])
const loadingParticipants = ref(false)
const responding = ref(false)
const currentStatus = ref<RsvpStatus | null | undefined>(props.event.myRsvpStatus)

const fetchParticipants = async () => {
  loadingParticipants.value = true
  try {
    const res = await eventApi.getEventParticipants(props.event.eventId)
    if (res.success && res.data) participants.value = res.data
  } finally {
    loadingParticipants.value = false
  }
}

const statusMessages: Record<RsvpStatus, string> = {
  [RsvpStatus.Accepted]: "You're going!",
  [RsvpStatus.Declined]: 'Not going — response saved',
  [RsvpStatus.Maybe]: 'Marked as maybe',
  [RsvpStatus.Pending]: 'Response cleared',
}

const respond = async (status: RsvpStatus) => {
  if (responding.value) return
  responding.value = true
  try {
    const res = await eventApi.respondToEvent({ eventId: props.event.eventId, status })
    if (res.success && res.data) {
      currentStatus.value = res.data.status
      toast.add({ severity: 'success', summary: statusMessages[status], life: 2500 })
      await fetchParticipants()
      emits('update')
    }
  } catch {
    toast.add({ severity: 'error', summary: 'Failed to update RSVP', life: 3000 })
  } finally {
    responding.value = false
  }
}

const statusLabel = (status: RsvpStatus) => {
  if (status === RsvpStatus.Accepted) return 'Accepted'
  if (status === RsvpStatus.Declined) return 'Declined'
  if (status === RsvpStatus.Maybe) return 'Maybe'
  return 'Pending'
}

const participantName = (p: EventParticipantDtoResponse) =>
  p.nickname ?? `${p.firstName} ${p.lastName}`.trim() ?? p.email

onMounted(fetchParticipants)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-zinc-500 uppercase tracking-wide text-xs">Your RSVP</p>

    <!-- Status indicator -->
    <div class="flex items-center gap-2">
      <span
        class="flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
        :class="{
          'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300':
            currentStatus === RsvpStatus.Accepted,
          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':
            currentStatus === RsvpStatus.Declined,
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300':
            currentStatus === RsvpStatus.Maybe,
          'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300':
            currentStatus === RsvpStatus.Pending || currentStatus == null,
        }"
      >
        <CheckIcon v-if="currentStatus === RsvpStatus.Accepted" class="w-3.5 h-3.5" />
        <XMarkIcon v-else-if="currentStatus === RsvpStatus.Declined" class="w-3.5 h-3.5" />
        <ClockIcon v-else class="w-3.5 h-3.5" />
        {{ currentStatus != null ? statusLabel(currentStatus) : 'Pending' }}
      </span>
    </div>

    <!-- Response buttons -->
    <div class="flex gap-2">
      <ButtonComponent
        sm
        :primary="currentStatus === RsvpStatus.Accepted"
        :secondary="currentStatus !== RsvpStatus.Accepted"
        :disabled="responding"
        class="flex-1 justify-center"
        @click="respond(RsvpStatus.Accepted)"
      >
        <CheckIcon class="w-4 h-4" /> Going
      </ButtonComponent>
      <ButtonComponent
        sm
        :primary="currentStatus === RsvpStatus.Maybe"
        :secondary="currentStatus !== RsvpStatus.Maybe"
        :disabled="responding"
        class="flex-1 justify-center"
        @click="respond(RsvpStatus.Maybe)"
      >
        Maybe
      </ButtonComponent>
      <ButtonComponent
        sm
        :danger="currentStatus === RsvpStatus.Declined"
        :secondary="currentStatus !== RsvpStatus.Declined"
        :disabled="responding"
        class="flex-1 justify-center"
        @click="respond(RsvpStatus.Declined)"
      >
        <XMarkIcon class="w-4 h-4" /> No
      </ButtonComponent>
    </div>

    <!-- Participants -->
    <p class="text-zinc-500 uppercase tracking-wide text-xs mt-2">Participants</p>
    <div v-if="loadingParticipants" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-8 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
    </div>
    <ul v-else class="space-y-2">
      <li
        v-for="p in participants"
        :key="p.userId"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-zinc-800 dark:text-zinc-200">{{ participantName(p) }}</span>
        <span
          class="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
          :class="{
            'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300':
              p.status === RsvpStatus.Accepted,
            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300':
              p.status === RsvpStatus.Declined,
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300':
              p.status === RsvpStatus.Maybe,
            'bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400':
              p.status === RsvpStatus.Pending,
          }"
        >
          <CheckIcon v-if="p.status === RsvpStatus.Accepted" class="w-3 h-3" />
          <XMarkIcon v-else-if="p.status === RsvpStatus.Declined" class="w-3 h-3" />
          <ClockIcon v-else class="w-3 h-3" />
          {{ statusLabel(p.status) }}
        </span>
      </li>
    </ul>
  </div>
</template>
