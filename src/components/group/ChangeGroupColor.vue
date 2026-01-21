<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints';
import type { UpdateUserGroupSettingsDtoRequest } from '@/types/group';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
const toast = useToast();
const props = defineProps<{
    groupId: number;
    groupColor: string;
}>();
const newGroupSettings = ref<UpdateUserGroupSettingsDtoRequest>({
    groupId: props.groupId,
    groupColor: props.groupColor
});
const availableColors: string[] = [
    "zinc",
    "red",
    "blue",
    "green"
]
const updateGroupColor = async (req: UpdateUserGroupSettingsDtoRequest) => {
    try {
        const res = await groupApi.updateUserGroupSettings(req);
        if (res.success) {
            toast.add({
                severity: "success",
                summary: `You updated the group color`,
                life: 5000
            })
        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: `Failed to leave the group`,
            life: 5000

        })
        console.error(error);
    }
}
</script>
<template>
    <div class="">
        <p>Choose color</p>

        <ul class="flex flex-col gap-3">
            <fieldset @change="updateGroupColor(newGroupSettings)">
                <div v-for="color in availableColors" :key="color">
                    <input v-model="newGroupSettings.groupColor" :value="color" name="color" :id="`color-${color}`"
                        type="radio" />
                    <label :for="`color-${color}`">{{ color }}</label>

                </div>
            </fieldset>

        </ul>
    </div>
</template>