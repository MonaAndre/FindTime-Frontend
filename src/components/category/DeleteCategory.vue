<script setup lang="ts">
import { useToast } from 'primevue/usetoast';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import type { DeleteCategoryDtoRequest } from '@/types/category';
import { categoryApi } from '@/endpoints/categoryEndpoints';
import { ref } from 'vue';
import { TrashIcon } from '@heroicons/vue/24/outline';


const toast = useToast();
const handleDeleteCat = async (req: DeleteCategoryDtoRequest) => {
    try {
        const result = await categoryApi.deleteCategory(req);
        if (result.success) {
            toast.add({
                severity: "success",
                summary: "New category created",
                life: 5000
            })
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

const props = defineProps<{
    groupId: number,
    categoryId: number
}>();

const emits = defineEmits<{
    (e: 'update'): void;
}>();

const deletCatReq = ref<DeleteCategoryDtoRequest>({
    groupId: props.groupId,
    categoryId: props.categoryId

}
) 
</script>
<template>
    <ButtonComponent sm danger @click="handleDeleteCat(deletCatReq)">
        <TrashIcon class="w-5" />
    </ButtonComponent>
</template>