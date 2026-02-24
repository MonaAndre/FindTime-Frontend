<script setup lang="ts">
import type { GroupCategoryGroupDto } from '@/types/group';
import Select from 'primevue/select';
import { ref } from 'vue';

const props = defineProps<{
    groupCategories: GroupCategoryGroupDto[]
}>()

const chosenCatId = ref<number | null>(null);

const emits = defineEmits<{
    (e: 'setCategoryToEvent', categoryId: number): void;
}>()

const handleChangeCategoryValue = () => {
    if (chosenCatId.value !== null) {
        emits('setCategoryToEvent', chosenCatId.value)
    }
}
</script>
<template>
    <Select v-model="chosenCatId" :options="props.groupCategories" option-label="categoryName" option-value="categoryId"
        placeholder="Add category" class="w-3/5 mt-2 mb-5" @change="handleChangeCategoryValue" />
       
</template>