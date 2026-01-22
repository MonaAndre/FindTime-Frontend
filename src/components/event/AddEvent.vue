<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import TextInput from '../reusables/TextInput.vue'
import { ref } from 'vue'
import { eventApi } from '@/endpoints/eventEndpoints'

import { useToast } from 'primevue/usetoast'
import type { CreateEventDtoRequest } from '@/types/events'


const showForm = ref(false);
const toast = useToast();

const props = defineProps<{
    groupId: number
}>();

const emits = defineEmits<{
    (e: 'update'): void;
}>();

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
    recurrenceEndTime: null
})

const handleCreateEvent = async (req: CreateEventDtoRequest) => {
    console.log(createEventForm.value);
    try {
        const result = await eventApi.createEvent(req);
        if (result.success) {
            toast.add({
                severity: "success",
                summary: "New event created",
                life: 5000
            })
            showForm.value = false;
            emits('update');
        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to create event",
            life: 5000
        })
        console.error(error);
    }

}


</script>

<template>
    <div>
        <ButtonComponent margin-y @click="showForm = true" lg secondary>
            <PlusIcon class="h-5 w-5" />Add Event
        </ButtonComponent>

        <div v-if="showForm">
            <form class="form" @submit.prevent="handleCreateEvent(createEventForm)">
                <TextInput :placeholder="'Event name'" :type="'text'" :name="'event-name'"
                    v-model="createEventForm.eventName">Event name</TextInput>
                <TextInput :placeholder="'Event description'" :type="'text'" :name="'event-description'"
                    v-model="createEventForm.eventDescription">Event description</TextInput>
                <TextInput name="start-time" v-model="createEventForm.startTime" type="datetime-local"> Start date
                </TextInput>
                <TextInput name="end-time" v-model="createEventForm.endTime" type="datetime-local"> End date</TextInput>
                <TextInput name="location" v-model="createEventForm.location" placeholder="Event location" type="text">
                    Location</TextInput>

                <ButtonComponent margin-y type="submit" primary lg center>Create group</ButtonComponent>
            </form>
        </div>

    </div>
</template>
