<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { ref } from 'vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { UpdateRecurringOption, type GetAllGroupEventsResponse, type UpdateEventDtoRequest } from '@/types/events';
import TextInput from '../reusables/TextInput.vue';
import { eventApi } from '@/endpoints/eventEndpoints';
import { useToast } from 'primevue/usetoast';

const visible = ref(false);
const toast = useToast();

const props = defineProps<{
    eventData: GetAllGroupEventsResponse

}>();

const emits = defineEmits<{
    (e: 'update'): void;
}>();

const updateEventForm = ref<UpdateEventDtoRequest>({
    eventId: props.eventData.eventId!,
    eventName: props.eventData.eventName!,
    eventDescription: props.eventData.eventDescription,
    startTime: props.eventData.startTime,
    endTime: props.eventData.endTime,
    categoryId: props.eventData.categoryId,
    location: props.eventData.location,
    updateOption: UpdateRecurringOption.ThisEventOnly
})

const handleUpdateEvent = async (res: UpdateEventDtoRequest) => {
    try {
        const result = await eventApi.updateEvent(res);
        if (result.success) {
            toast.add({
                severity: "success",
                summary: "Event updated",
                life: 5000
            })
            emits('update');

        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to update event",
            life: 5000
        })
        console.error(error);
    }
}
</script>
<template>
    <ButtonComponent primary sm @click="visible = true">Update event</ButtonComponent>

    <Dialog v-model:visible="visible" modal header="Update Event" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-2">Update event {{ updateEventForm.eventId
            }}:</span>
        <form class="" @submit.prevent="handleUpdateEvent(updateEventForm)">
            <div class="flex items-center gap-4 mb-2">
                <TextInput type="text" name="event-name" v-model="updateEventForm.eventName">New Name</TextInput>
            </div>
            <div class="flex items-center gap-4 mb-2">
                <TextInput type="text" name="event-description" v-model="updateEventForm.eventDescription">New
                    description
                </TextInput>
            </div>
            <div class="flex items-center gap-4 mb-2">
                <TextInput name="start-time" v-model="updateEventForm.startTime" type="datetime-local"> Start date
                </TextInput>
            </div>
            <div class="flex items-center gap-4 mb-2">
                <TextInput name="end-time" v-model="updateEventForm.endTime" type="datetime-local"> End date</TextInput>
            </div>

            <div class="flex justify-end mt-5 gap-2">
                <ButtonComponent @click="visible = false" tertiary lg>Cancel</ButtonComponent>
                <ButtonComponent type="submit" @click="visible = false" tertiary lg>Save</ButtonComponent>

            </div>

        </form>

    </Dialog>
</template>