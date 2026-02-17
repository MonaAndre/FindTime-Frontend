<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import TextInput from '../reusables/TextInput.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import ToggleSwitch from 'primevue/toggleswitch'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'
import { eventApi } from '@/endpoints/eventEndpoints'
import { RecurrencePattern, type CreateEventDtoRequest } from '@/types/events'
import type { GroupCategoryGroupDto } from '@/types/group'
import { addYears } from 'date-fns'

const props = defineProps<{
  visible: boolean
  groupId: number
  groupCategories: GroupCategoryGroupDto[]
  initialDate?: Date | null
}>()

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update'): void
}>()

const toast = useToast()

const recurrenceOptions = [
  { label: 'Daily', value: RecurrencePattern.Daily },
  { label: 'Weekly', value: RecurrencePattern.Weekly },
  { label: 'Monthly', value: RecurrencePattern.Monthly },
  { label: 'Yearly', value: RecurrencePattern.Yearly },
]

const createEventForm = ref<CreateEventDtoRequest>({
  eventName: '',
  eventDescription: null,
  groupId: props.groupId,
  startTime: '',
  endTime: '',
  categoryId: undefined,
  location: '',
  isRecurring: false,
  recurrencePattern: undefined,
  recurrenceEndTime: null,
})

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const recurrenceEndDate = ref<Date | null>(null)
const maxDate = addYears(startDate.value ?? new Date(), 2)

const resetForm = () => {
  createEventForm.value = {
    eventName: '',
    eventDescription: null,
    groupId: props.groupId,
    startTime: '',
    endTime: '',
    categoryId: undefined,
    location: '',
    isRecurring: false,
    recurrencePattern: undefined,
    recurrenceEndTime: null,
  }
  startDate.value = null
  endDate.value = null
  recurrenceEndDate.value = null
}

const initializeFormWithDate = (date: Date) => {
  const start = new Date(date)
  start.setHours(9, 0, 0, 0)
  const end = new Date(date)
  end.setHours(10, 0, 0, 0)
  createEventForm.value.startTime = start.toISOString().slice(0, -1)
  createEventForm.value.endTime = end.toISOString().slice(0, -1)
}

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible && props.initialDate) {
      initializeFormWithDate(props.initialDate)
    } else if (!isVisible) {
      setTimeout(() => resetForm(), 300)
    }
  },
)

const handleCreateEvent = async (req: CreateEventDtoRequest) => {
  try {
    const result = await eventApi.createEvent(req)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'New event created',
        life: 5000,
      })
      emits('update:visible', false)
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to create event',
      life: 5000,
    })
    console.error(error)
  }
}

const closeDialog = () => {
  emits('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emits('update:visible', $event)"
    modal
    header="Add event"
    class=" w-full md:w-1/2"
  >
    <form @submit.prevent="handleCreateEvent(createEventForm)" class="space-y-4">
      <TextInput
        placeholder="Event name"
        type="text"
        name="event-name"
        v-model="createEventForm.eventName"
        required
      >
        Event name
      </TextInput>

      <TextInput
        placeholder="Event description"
        type="text"
        name="event-description"
        v-model="createEventForm.eventDescription"
      >
        Event description
      </TextInput>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block my-2 text-sm/6 font-medium text-zinc-900 dark:text-zinc-100">
            Start date & time
          </label>
          <VueDatePicker v-model="createEventForm.startTime" />
        </div>

        <div>
          <label class="block my-2 text-sm/6 font-medium text-zinc-900 dark:text-zinc-100">
            End date & time
          </label>
          <VueDatePicker v-model="createEventForm.endTime" />
        </div>
      </div>

      <TextInput
        name="location"
        v-model="createEventForm.location"
        placeholder="Event location"
        type="text"
      >
        Location
      </TextInput>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-zinc-900 dark:text-zinc-100"> Category </label>
        <Select 
          v-model="createEventForm.categoryId"
          :options="groupCategories"
          option-label="categoryName"
          option-value="categoryId"
          placeholder="Select category (optional)"
          class="w-full dark:bg-zinc-700!"
        />
      </div>

      <div class="flex gap-3 items-center">
        <label class="text-sm font-medium text-zinc-900 dark:text-zinc-100" for="is-recurring">
          Recurring event?
        </label>
        <ToggleSwitch name="is-recurring" v-model="createEventForm.isRecurring" />
      </div>

      <div
        v-if="createEventForm.isRecurring"
        class="space-y-4 pl-4 border-l-2 border-blue-500 dark:border-blue-400"
      >
        <div class="space-y-2">
          <label class="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Recurrence pattern
          </label>
          <Select
            v-model="createEventForm.recurrencePattern"
            :options="recurrenceOptions"
            option-label="label"
            option-value="value"
            placeholder="Select recurrence"
            class="w-full"
          />
        </div>

        <div>
          <label class="block my-2 text-sm/6 font-medium text-zinc-900 dark:text-zinc-100">
            Repeat until
          </label>
          <VueDatePicker v-model="createEventForm.recurrenceEndTime" :max-date="maxDate" />
        </div>
      </div>

      <div
        class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800"
      >
        <ButtonComponent secondary lg @click="closeDialog" type="button"> Cancel </ButtonComponent>
        <ButtonComponent primary lg type="submit"> Add </ButtonComponent>
      </div>
    </form>
  </Dialog>
</template>
