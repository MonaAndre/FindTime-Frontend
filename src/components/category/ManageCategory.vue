<script setup lang="ts">
import { categoryApi } from '@/endpoints/categoryEndpoints'
import type { CategoryListDtoResponse } from '@/types/category'
import { onMounted, ref } from 'vue'
import AddCategory from './AddCategory.vue'
import DeleteCategory from './DeleteCategory.vue'
import UpdateCategory from './UpdateCategory.vue'
import {  getCategoryLabel } from '@/helpers/colors'

const categoryList = ref<CategoryListDtoResponse[]>([])

const props = defineProps<{
  groupId: number
}>()

const emits = defineEmits<{
  (e: 'update'): void
}>()

const handleGetCategories = async (groupId: number) => {
  try {
    const result = await categoryApi.getAllCategories(groupId)
    if (result.success) {
      categoryList.value = result.data ? result.data : []
    }
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  handleGetCategories(props.groupId)
})

const refreshData = () => {
  handleGetCategories(props.groupId)
  emits('update')
}
</script>
<template>
  <section>
    <AddCategory @update="refreshData" :group-id="props.groupId" />
    <h3 class="text-center font-bold my-5">Category list:</h3>
    <ul class="flex gap-10 flex-wrap my-5" v-if="categoryList.length > 0">
      <li
        v-for="category in categoryList"
        :key="category.categoryId"
        class="flex gap-1 items-center"
      >
        <span :class="getCategoryLabel(category.categoryColor!)">{{ category.categoryName }}</span>
        <UpdateCategory
          @update="refreshData"
          v-if="category.categoryColor && category.categoryName"
          :category-color="category.categoryColor"
          :category-id="category.categoryId"
          :group-id="props.groupId"
          :category-name="category.categoryName"
        />
        <DeleteCategory
          @update="refreshData"
          :group-id="props.groupId"
          :category-id="category.categoryId"
        />
      </li>
    </ul>
  </section>
</template>
