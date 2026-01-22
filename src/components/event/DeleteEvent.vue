<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import { DeleteRecurringOption, type DeleteEventDtoRequest } from '@/types/events';
import { eventApi } from '@/endpoints/eventEndpoints';
import { useToast } from 'primevue/usetoast';
const showDeleteModal = ref(false);
const props = defineProps<{
    eventId: number;
}>();
const toast = useToast();
const recurrenceOptions = [
    { label: 'This event only', value: DeleteRecurringOption.ThisEventOnly },
    { label: 'This and future events', value: DeleteRecurringOption.ThisAndFutureEvents },
    { label: 'All events', value: DeleteRecurringOption.AllEvents },
];

const deleteEventDetails = ref<DeleteEventDtoRequest>({
    eventId: props.eventId,
    deleteOption: DeleteRecurringOption.ThisEventOnly

});
const emits = defineEmits<{
    (e: 'update'): void;
}>();

const deleteEvent = async (req: DeleteEventDtoRequest) => {
    try {
        const res = await eventApi.deleteEvent(req);
        if (res.success) {
            toast.add({
                severity: "success",
                summary: "Event deleted",
                life: 5000
            });
            showDeleteModal.value = false;
            emits("update");
        }

    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to delete event",
            life: 5000
        })
        console.error(error);
    }
}
</script>

<template>
    <ButtonComponent @click="showDeleteModal = true" danger sm>Delete event</ButtonComponent>
    <Dialog v-model:visible="showDeleteModal" modal header="Update Event" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-2">Delete event {{ props.eventId
        }}:</span>

        <Select v-model="deleteEventDetails.deleteOption" :options="recurrenceOptions" option-label="label"
            option-value="value" placeholder="Select update option" class="w-3/5" />
        <ButtonComponent margin-y md danger @click="deleteEvent(deleteEventDetails)">Delete</ButtonComponent>
    </Dialog>

</template>