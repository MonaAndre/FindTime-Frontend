<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { ref, watch } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import {
  UpdateRecurringOption,
  type GetAllGroupEventsResponse,
  type UpdateEventDtoRequest,
} from '@/types/events'
import TextInput from '../reusables/TextInput.vue'
import { eventApi } from '@/endpoints/eventEndpoints'
import { useToast } from 'primevue/usetoast'
import Select from 'primevue/select'
import type { GroupCategoryGroupDto } from '@/types/group'
import { PencilIcon } from '@heroicons/vue/24/outline'
import AppDatePicker from '../layout/AppDatePicker.vue'

const visible = ref(false)
const toast = useToast()

const props = defineProps<{
  eventData: GetAllGroupEventsResponse
  groupCategories: GroupCategoryGroupDto[]
}>()
const recurrenceOptions = [
  { label: 'This event only', value: UpdateRecurringOption.ThisEventOnly },
  { label: 'This and future events', value: UpdateRecurringOption.ThisAndFutureEvents },
  { label: 'All events', value: UpdateRecurringOption.AllEvents },
]

const emits = defineEmits<{
  (e: 'update'): void
}>()

const updateEventForm = ref<UpdateEventDtoRequest>({
  eventId: props.eventData.eventId!,
  eventName: props.eventData.eventName!,
  eventDescription: props.eventData.eventDescription,
  startTime: props.eventData.startTime,
  endTime: props.eventData.endTime,
  location: props.eventData.location,
  updateOption: UpdateRecurringOption.ThisEventOnly,
})
watch(
  () => props.eventData,
  (newEventData) => {
    updateEventForm.value = {
      eventId: newEventData.eventId!,
      eventName: newEventData.eventName!,
      eventDescription: newEventData.eventDescription,
      startTime: newEventData.startTime,
      endTime: newEventData.endTime,
      location: newEventData.location,
      updateOption: UpdateRecurringOption.ThisEventOnly,
    }
  },
  { deep: true },
)

watch(visible, (isVisible) => {
  if (isVisible) {
    updateEventForm.value = {
      eventId: props.eventData.eventId!,
      eventName: props.eventData.eventName!,
      eventDescription: props.eventData.eventDescription,
      startTime: props.eventData.startTime,
      endTime: props.eventData.endTime,
      location: props.eventData.location,
      updateOption: UpdateRecurringOption.ThisEventOnly,
    }
  }
})

const handleUpdateEvent = async (req: UpdateEventDtoRequest) => {
  try {
    console.log(req)
    const result = await eventApi.updateEvent(req)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Event updated',
        life: 5000,
      })
      emits('update')
      visible.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to update event',
      life: 5000,
    })
    console.error(error)
  }
}
</script>
<template>
  <ButtonComponent primary sm @click="visible = true"
    ><PencilIcon class="w-4 h-4 mr-2" />Update event</ButtonComponent
  >

  <Dialog v-model:visible="visible" modal header="Update Event" class="w-full md:w-1/2">
    <form class="w-full" @submit.prevent="handleUpdateEvent(updateEventForm)">
      <TextInput type="text" name="event-name" v-model="updateEventForm.eventName"
        >Event Name</TextInput
      >

      <TextInput type="text" name="event-description" v-model="updateEventForm.eventDescription"
        >description
      </TextInput>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label
            class="block my-2 text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100"
          >
            Start time
          </label>
          <AppDatePicker v-model="updateEventForm.startTime" />
        </div>

        <div>
          <label
            class="block my-2 text-xs uppercase tracking-wide font-medium text-zinc-900 dark:text-zinc-100"
          >
            End date
          </label>
          <AppDatePicker v-model="updateEventForm.endTime" />
        </div>
      </div>

      <div class="flex flex-col gap-2 mt-6">
        <label class="text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100"
          >Apply update to</label
        >
        <Select
          v-model="updateEventForm.updateOption"
          :options="recurrenceOptions"
          option-label="label"
          option-value="value"
          placeholder="Select update option"
          class="w-full dark:bg-zinc-700!"
        />
      </div>

      <div class="flex justify-end mt-5 gap-2">
        <ButtonComponent @click="visible = false" tertiary lg>Cancel</ButtonComponent>
        <ButtonComponent type="submit" @click="visible = false" primary lg>Save</ButtonComponent>
      </div>
    </form>
  </Dialog>
</template>
