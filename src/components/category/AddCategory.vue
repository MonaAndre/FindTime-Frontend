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
import { userGroupStore } from '@/stores/userGroupStore'

const toast = useToast()

const props = defineProps<{
  groupId: number
}>()

const groupStore = userGroupStore()

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
      createCatReq.value = {
        categoryName: '',
        groupId: props.groupId,
      }
      groupStore.fetchCategories()
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
    <ButtonComponent v-if="!showForm" center @click="showForm = true" lg secondary>
      <PlusIcon class="h-5 w-5" />Add category
    </ButtonComponent>

    <form @submit.prevent="handleCreateCategory(createCatReq)" v-if="showForm">
      <TextInput
        v-model="createCatReq.categoryName"
        placeholder="Category name"
        name="category-name"
        >Category name
      </TextInput>
      <p class="block my-2 text-sm/6 font-medium text-zinc-900">Choose color</p>
      <ul>
        <fieldset class="grid grid-cols-5 items-center justify-center gap-3">
          <div v-for="color in availableColors" :key="color">
            <div
              :class="
                createCatReq.categoryColor === color
                  ? 'border-2 flex justify-center items-center border-blue-600 overflow-hidden rounded-full h-6 w-6 '
                  : 'flex justify-center items-center overflow-hidden rounded-full h-6 w-6 '
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
                <div :class="getBgColors(color)" class="h-6 w-6  transition-all"></div>
              </label>
            </div>
          </div>
        </fieldset>
      </ul>
      <div class="flex justify-center items-center gap-4 mt-2">
        <ButtonComponent tertiary margin-y lg @click="showForm = false">Cancel</ButtonComponent>
        <ButtonComponent margin-y type="submit" primary lg>Add category</ButtonComponent>
      </div>
    </form>
  </section>
</template>
