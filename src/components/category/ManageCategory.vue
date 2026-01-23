<script setup lang="ts">
import { categoryApi } from '@/endpoints/categoryEndpoints'
import type { CategoryListDtoResponse } from '@/types/category'
import { onMounted, ref } from 'vue'
import AddCategory from './AddCategory.vue'
import DeleteCategory from './DeleteCategory.vue'
import UpdateCategory from './UpdateCategory.vue'


const categoryList = ref<CategoryListDtoResponse[]>([])

const bgClass = (color?: string) => {
    const colorMap: Record<string, string> = {
        zinc: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200 border border-zinc-700 rounded-xl p-2 inline',
        pink: 'bg-pink-200 text-pink-700 dark:bg-pink-600 dark:text-pink-200 border border-pink-700 rounded-xl p-2 inline',
        red: 'bg-red-200 text-red-700 dark:bg-red-600 dark:text-red-200  border border-red-700 rounded-xl p-2 inline',
        blue: 'bg-blue-200 text-blue-700 dark:bg-blue-600 dark:text-blue-200  border border-blue-700 rounded-xl p-2 inline',
        green: 'bg-green-200 text-green-700 dark:bg-green-600 dark:text-green-200  border border-green-700 rounded-xl p-2 inline',
        orange: 'bg-orange-200 text-orange-700 dark:bg-orange-600 dark:text-orange-200 border border-orange-700 rounded-xl p-2 inline',
    }
    return colorMap[color || 'red'] || 'bg-red-500 dark:bg-zinc-500'
}

const props = defineProps<{
    groupId: number
}>();



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



</script>
<template>
    <section>
        <h2 class="text-center font-bold text-2xl my-5">Manage group categories for events</h2>
        <AddCategory @update="handleGetCategories(props.groupId)" :group-id="props.groupId" />
        <h3 class="text-center font-bold my-5">Category list:</h3>
        <ul class="flex gap-10 flex-wrap my-5" v-if="categoryList.length > 0">
            <li v-for="category in categoryList" :key="category.categoryId" class="flex  gap-1 items-center">

                <span :class="bgClass(category.categoryColor)">{{ category.categoryName }}</span>
                <UpdateCategory v-if="category.categoryColor && category.categoryName"
                    :category-color="category.categoryColor" :category-id="category.categoryId"
                    :group-id="props.groupId" :category-name="category.categoryName" @update="handleGetCategories(props.groupId)"/>
                <DeleteCategory :group-id="props.groupId" :category-id="category.categoryId" @update="handleGetCategories(props.groupId)"/>
            </li>
        </ul>
    </section>
</template>
