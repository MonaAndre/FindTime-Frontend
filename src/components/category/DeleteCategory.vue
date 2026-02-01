<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import type { DeleteCategoryDtoRequest } from '@/types/category'
import { categoryApi } from '@/endpoints/categoryEndpoints'
import { ref } from 'vue'
import { userGroupStore } from '@/stores/userGroupStore'
const groupStore = userGroupStore()
const toast = useToast()
const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const handleDeleteCat = async (req: DeleteCategoryDtoRequest) => {
  try {
    const result = await categoryApi.deleteCategory(req)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Category deleted',
        life: 5000,
      })
      groupStore.fetchEvents()
      groupStore.fetchCategories()
      emit('cancel')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to delete category',
      life: 5000,
    })
    console.error(error)
  }
}

const props = defineProps<{
  groupId: number
  categoryId: number
}>()

const deletCatReq = ref<DeleteCategoryDtoRequest>({
  groupId: props.groupId,
  categoryId: props.categoryId,
})
</script>
<template>
  <p>You are about to delete the category, confirm your actions</p>

  <div class="flex justify-end gap-3 mt-10">
    <ButtonComponent md tertiary @click="$emit('cancel')">Cancel</ButtonComponent>
    <ButtonComponent md danger @click="handleDeleteCat(deletCatReq)"> Delete </ButtonComponent>
  </div>
</template>
