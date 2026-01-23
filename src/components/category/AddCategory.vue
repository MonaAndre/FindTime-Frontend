<script setup lang="ts">
import { ref } from 'vue';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import TextInput from '../reusables/TextInput.vue';
import type { CreateCategoryDtoRequest } from '@/types/category';
import { categoryApi } from '@/endpoints/categoryEndpoints';
import { useToast } from 'primevue/usetoast';
import { PlusIcon } from '@heroicons/vue/24/outline';

const toast = useToast();

const props = defineProps<{
    groupId: number
}>();

const emits = defineEmits<{
    (e: 'update'): void;
}>()

const createCatReq = ref<CreateCategoryDtoRequest>({
    groupId: props.groupId,
    categoryName: '',
    categoryColor: 'zinc'
})
const handleCreateCategory = async (req: CreateCategoryDtoRequest) => {
    try {
        const result = await categoryApi.createCategory(req);
        if (result.success) {
            toast.add({
                severity: "success",
                summary: "New category created",
                life: 5000
            })
            showForm.value = false;
            emits('update');
        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to create category",
            life: 5000
        })
        console.error(error);
    }
}

const showForm = ref(false)
</script>
<template>
    <ButtonComponent end @click="showForm = true" lg secondary>
     <PlusIcon class="h-5 w-5" />Add category in this group
    </ButtonComponent>
    <form @submit.prevent="handleCreateCategory(createCatReq)" v-if="showForm">
        <TextInput v-model="createCatReq.categoryName" placeholder="Category name" name="category-name">Category name
        </TextInput>
        <TextInput v-model="createCatReq.categoryColor" placeholder="Category color" name="category-color">Category
            color</TextInput>
        <ButtonComponent margin-y type="submit" primary lg center>Add category</ButtonComponent>
    </form>
</template>