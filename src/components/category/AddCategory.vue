<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import TextInput from '../reusables/TextInput.vue'
import type { CreateCategoryDtoRequest } from '@/types/category'
import { categoryApi } from '@/endpoints/categoryEndpoints'
import { useToast } from 'primevue/usetoast'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { getBgColors } from '@/helpers/colors'
import { availableColors } from '@/types/colorList'

const toast = useToast()

const props = defineProps<{
  groupId: number
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const createCatReq = ref<CreateCategoryDtoRequest>({
  groupId: props.groupId,
  categoryName: '',
  categoryColor: 'zinc',
})
const handleCreateCategory = async (req: CreateCategoryDtoRequest) => {
  try {
    const result = await categoryApi.createCategory(req)
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'New category created',
        life: 5000,
      })
      showForm.value = false
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to create category',
      life: 5000,
    })
    console.error(error)
  }
}

const showForm = ref(false)
</script>
<template>
  <section class="px-2">
    <ButtonComponent center @click="showForm = true" lg secondary>
      <PlusIcon class="h-5 w-5" />Add category in this group
    </ButtonComponent>
    <form @submit.prevent="handleCreateCategory(createCatReq)" v-if="showForm">
      <TextInput
        v-model="createCatReq.categoryName"
        placeholder="Category name"
        name="category-name"
        >Category name
      </TextInput>
      <p>Choose color</p>
      <ul>
        <fieldset class="flex items-center justify-center gap-3 flex-wrap">
          <div v-for="color in availableColors" :key="color">
            <div
              :class="
                createCatReq.categoryColor === color
                  ? 'border-2 p-1 border-blue-600 rounded-full '
                  : ''
              "
            >
              <label class="cursor-pointer" :for="`color-${color}`">
                <input
                  class="hidden"
                  v-model="createCatReq.categoryColor"
                  :value="color"
                  name="color"
                  :id="`color-${color}`"
                  type="radio"
                />
                <div :class="getBgColors(color)" class="h-5 w-5 rounded-full transition-all"></div>
              </label>
            </div>
          </div>
        </fieldset>
      </ul>

      <ButtonComponent margin-y type="submit" primary lg center>Add category</ButtonComponent>
    </form>
  </section>
</template>
