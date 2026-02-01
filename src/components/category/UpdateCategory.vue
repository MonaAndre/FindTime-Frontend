<script setup lang="ts">
import type { UpdateCategoryRequestDto } from '@/types/category'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import TextInput from '../reusables/TextInput.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { categoryApi } from '@/endpoints/categoryEndpoints'
import { getBgColors } from '@/helpers/colors'
import { availableColors } from '@/types/colorList'

const toast = useToast()

const props = defineProps<{
  groupId: number
  categoryId: number
  categoryColor: string
  categoryName: string
}>()

const emits = defineEmits<{
  (e: 'update'): void
  (e: 'close'): void
}>()

const updateCategoryForm = ref<UpdateCategoryRequestDto>({
  categoryId: props.categoryId,
  groupId: props.groupId,
  categoryColor: props.categoryColor,
  categoryName: props.categoryName,
})

const handleUpdateCat = async (res: UpdateCategoryRequestDto) => {
  try {
    const result = await categoryApi.updateCategory(res)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Category updated',
        life: 5000,
      })
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to category event',
      life: 5000,
    })
    console.error(error)
  }
}
</script>
<template>
  <form class="" @submit.prevent="handleUpdateCat(updateCategoryForm)">
    <div class="flex items-center gap-4 mb-2">
      <TextInput type="text" name="category-name" v-model="updateCategoryForm.categoryName"
        >New Name
      </TextInput>
    </div>
    <label class="block my-2 text-sm/6 font-medium text-zinc-900">Color</label>
    <div class="flex items-center gap-4 mb-2 flex-wrap">
      <div v-for="color in availableColors" :key="color">
        <div
          :class="
            updateCategoryForm.categoryColor === color
              ? 'border-2 p-1 border-blue-600 rounded-full '
              : ''
          "
        >
          <label class="cursor-pointer" :for="`color-${color}`">
            <input
              class="hidden"
              v-model="updateCategoryForm.categoryColor"
              :value="color"
              name="color"
              :id="`color-${color}`"
              type="radio"
            />
            <div :class="getBgColors(color)" class="h-5 w-5 rounded-full transition-all"></div>
          </label>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-5 gap-2">
      <ButtonComponent @click="$emit('close')" tertiary lg>Cancel</ButtonComponent>
      <ButtonComponent type="submit" tertiary lg>Save</ButtonComponent>
    </div>
  </form>
</template>
