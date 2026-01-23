<script setup lang="ts">
import type { UpdateCategoryRequestDto } from '@/types/category';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { categoryApi } from '@/endpoints/categoryEndpoints';
import Dialog from 'primevue/dialog';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';



const visible = ref(false);
const toast = useToast();

const props = defineProps<{
    groupId: number,
    categoryId: number,
    categoryColor: string,
    categoryName: string
}>();

const emits = defineEmits<{
    (e: 'update'): void;
}>();

const updateCategoryForm = ref<UpdateCategoryRequestDto>({
    categoryId: props.categoryId,
    groupId: props.groupId,
    categoryColor: props.categoryColor,
    categoryName: props.categoryName
})

const handleUpdateCat = async (res: UpdateCategoryRequestDto) => {
    try {
        const result = await categoryApi.updateCategory(res);
        if (result.success) {
            toast.add({
                severity: "success",
                summary: "Category updated",
                life: 5000
            })
            emits('update');

        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to category event",
            life: 5000
        })
        console.error(error);
    }
}
</script>
<template>
    <ButtonComponent primary sm @click="visible = true"> <PencilSquareIcon class="h-5 w-5" /></ButtonComponent>

    <Dialog v-model:visible="visible" modal header="Update Event" :style="{ width: '25rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-2">Update event {{ updateCategoryForm.categoryId
        }}:</span>
        <form class="" @submit.prevent="handleUpdateCat(updateCategoryForm)">
            <div class="flex items-center gap-4 mb-2">
                <TextInput type="text" name="category-name" v-model="updateCategoryForm.categoryName">New Name
                </TextInput>
            </div>
            <div class="flex items-center gap-4 mb-2">
                <TextInput type="text" name="category-color-description" v-model="updateCategoryForm.categoryColor">New
                    color
                </TextInput>
            </div>


            <div class="flex justify-end mt-5 gap-2">
                <ButtonComponent @click="visible = false" tertiary lg>Cancel</ButtonComponent>
                <ButtonComponent type="submit" @click="visible = false" tertiary lg>Save</ButtonComponent>

            </div>

        </form>

    </Dialog>
</template>