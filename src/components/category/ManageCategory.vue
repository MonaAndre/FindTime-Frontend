<script setup lang="ts">
import type { CategoryListDtoResponse } from '@/types/category'
import { ref } from 'vue'
import AddCategory from './AddCategory.vue'
import DeleteCategory from './DeleteCategory.vue'
import UpdateCategory from './UpdateCategory.vue'
import { getCategoryLabel } from '@/helpers/colors'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import Dialog from 'primevue/dialog'
import { userGroupStore } from '@/stores/userGroupStore'
// import { useToast } from 'primevue/usetoast'

const groupStore = userGroupStore()
//const toast = useToast()

const menu = ref()
const selectedCategory = ref<CategoryListDtoResponse | null>(null)
const showUpdateDialog = ref(false)
const showDeleteDialog = ref(false)

const menuItems = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      showUpdateDialog.value = true
    },
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      showDeleteDialog.value = true
    },
    class: 'text-red-500',
  },
])

const toggle = (event: Event, category: CategoryListDtoResponse) => {
  selectedCategory.value = category
  menu.value.toggle(event)
}

const refreshCategories = async () => {
  await groupStore.fetchCategories()
  closeDialogs()
}

const closeDialogs = () => {
  showUpdateDialog.value = false
  showDeleteDialog.value = false
  selectedCategory.value = null
}
</script>

<template>
  <section>
    <AddCategory @update="refreshCategories" :group-id="groupStore.groupId || 0" />

    <h3 class="text-center font-bold my-5">Category list:</h3>

    <div v-if="groupStore.categories.length > 0" class="space-y-3">
      <div
        v-for="category in groupStore.categories"
        :key="category.categoryId"
        class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-3">
          <span
            class="w-4 h-4 rounded-full border-2 border-gray-300"
            :class="getCategoryLabel(category.categoryColor)"
          ></span>
          <span class="font-medium text-gray-900">{{ category.categoryName }}</span>
        </div>

        <div class="flex items-center gap-2">
          <Button
            type="button"
            @click="(event) => toggle(event, category)"
            aria-haspopup="true"
            aria-controls="overlay_menu"
            severity="secondary"
            text
            rounded
            class="w-8 h-8"
          >
            <template #icon>
              <EllipsisVerticalIcon class="w-5 h-5" />
            </template>
          </Button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <i class="pi pi-inbox text-4xl mb-3 block"></i>
      <p>No categories found</p>
    </div>

    <!-- PrimeVue Menu -->
    <Menu
      ref="menu"
      id="overlay_menu"
      :model="menuItems"
      :popup="true"
      class="min-w-32 shadow-lg border border-gray-200"
    />

    <!-- Update Modal - Triggered by Edit menu action -->

    <!-- Delete Modal - Triggered by Delete menu action -->
    <DeleteCategory
      v-if="showDeleteDialog && selectedCategory"
      @update="refreshCategories"
      @close="closeDialogs"
      :group-id="groupStore.groupId || 0"
      :category-id="selectedCategory.categoryId"
    />
  </section>

  <Dialog
    v-model:visible="showUpdateDialog"
    modal
    :header="'Update category'"
    :style="{ width: '18rem' }"
  >
    <UpdateCategory
      v-if="showUpdateDialog && selectedCategory"
      @update="refreshCategories"
      @close="closeDialogs"
      :category-color="selectedCategory.categoryColor!"
      :category-id="selectedCategory.categoryId"
      :group-id="groupStore.groupId || 0"
      :category-name="selectedCategory.categoryName!"
  /></Dialog>
</template>

<style scoped>
:deep(.p-menu .p-menuitem) {
  padding: 0;
}

:deep(.p-menu) {
  border-radius: 8px;
  overflow: hidden;
}
</style>
