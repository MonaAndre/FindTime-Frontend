<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'
import { DeleteRecurringOption, type DeleteEventDtoRequest } from '@/types/events'
import { eventApi } from '@/endpoints/eventEndpoints'
import { useToast } from 'primevue/usetoast'
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/vue/24/outline'
const showDeleteModal = ref(false)
const props = defineProps<{
  eventId: number
}>()
const toast = useToast()
const recurrenceOptions = [
  { label: 'This event only', value: DeleteRecurringOption.ThisEventOnly },
  { label: 'This and future events', value: DeleteRecurringOption.ThisAndFutureEvents },
  { label: 'All events', value: DeleteRecurringOption.AllEvents },
]

const deleteEventDetails = ref<DeleteEventDtoRequest>({
  eventId: props.eventId,
  deleteOption: DeleteRecurringOption.ThisEventOnly,
})
const emits = defineEmits<{
  (e: 'update'): void
}>()

const deleteEvent = async (req: DeleteEventDtoRequest) => {
  try {
    const res = await eventApi.deleteEvent(req)
    if (res.success) {
      toast.add({
        severity: 'success',
        summary: 'Event deleted',
        life: 5000,
      })
      showDeleteModal.value = false
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to delete event',
      life: 5000,
    })
    console.error(error)
  }
}
</script>

<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
    @click="showDeleteModal = true"
  >
    <TrashIcon class="h-4 w-4" />Delete event
  </button>
  <Dialog v-model:visible="showDeleteModal" :draggable="false" modal class="w-full md:w-96">
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <ExclamationTriangleIcon class="w-6 h-6 mt-1 text-red-500" />Delete event
      </div>
    </template>
    <span class="text-surface-800 dark:text-surface-400 text-sm block mb-5"
      >This action is permanent and can not be undone. Are you sure you want to remove this event
      from your calendar?</span
    >
    <label class="label-custom">Occurrence scope</label>
    <Select
      v-model="deleteEventDetails.deleteOption"
      :options="recurrenceOptions"
      option-label="label"
      option-value="value"
      placeholder="Select update option"
      class="w-full mt-3 dark:bg-zinc-700!"
    />
    <div class="flex justify-end gap-3 mt-4">
      <ButtonComponent @click="showDeleteModal = false" margin-y md tertiary
        >Cancel</ButtonComponent
      >
      <ButtonComponent margin-y md danger @click="deleteEvent(deleteEventDetails)"
        >Delete event</ButtonComponent
      >
    </div>
  </Dialog>
</template>
