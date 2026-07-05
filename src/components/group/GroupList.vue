<script setup lang="ts">
import GroupCard from '@/components/group/GroupCard.vue'
import { groupApi } from '@/endpoints/groupEndpoints'
import type { Group } from '@/types/group'
import { onMounted, ref } from 'vue'
import AddGroup from './AddGroup.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import NotificationBell from '@/components/layout/NotificationBell.vue'

const groupsArray = ref<Group[] | null>([])

const getGroups = async () => {
  try {
    const result = await groupApi.getGroups()
    if (result.success) {
      groupsArray.value = result.data
    }
  } catch (error) {
    console.error(error)
  }
}
const toggleCreate = ref(false)

const handleCreate = () => {
  getGroups()
  toggleCreate.value = false
}
onMounted(() => {
  getGroups()
})
</script>
<template>
  <section
    class="flex justify-between items-center px-3 border-b dark:border-zinc-600 border-zinc-300 bg-white dark:bg-zinc-900"
  >
    <p class="font-bold text-lg">My Calendars</p>
    <div class="flex items-center divide-x divide-zinc-300 dark:divide-zinc-600 gap-6">
      <div class="flex justify-center pr-2">
        <NotificationBell />
      </div>

      <AddGroup
        :toggle-form="toggleCreate"
        @create="handleCreate()"
        @close="toggleCreate = false"
      />
    </div>
  </section>

  <div class="groups-container">
    <div v-for="group in groupsArray" :key="group.groupId">
      <GroupCard
        :admin-email="group.adminEmail"
        :admin-name="group.adminName"
        :created-at="group.createdAt"
        :description="group.description"
        :group-id="group.groupId"
        :group-name="group.groupName"
        :is-admin="group.isAdmin"
        :joined-at="group.joinedAt"
        :member-count="group.memberCount"
        :group-color="group.groupColor"
      >
      </GroupCard>
    </div>
    <div
      @click="toggleCreate = true"
      class="group border border-dashed transition-custom border-zinc-400 hover:border-blue-700 hover:cursor-pointer rounded-lg p-3 flex flex-col justify-center items-center gap-4 bg-white dark:bg-zinc-800"
    >
      <div
        class="rounded-full group-hover:scale-125 transition-custom ease-in-out group-hover:bg-blue-600 bg-zinc-200 dark:bg-zinc-500 w-10 h-10 flex justify-center items-center text-zinc-500 dark:text-zinc-300"
      >
        <PlusIcon class="w-5 h-5 group-hover:text-white"></PlusIcon>
      </div>
      <p>New Calendar</p>
      <p class="text-zinc-500 text-xs dark:text-zinc-200">Create a new group</p>
    </div>
  </div>
</template>
