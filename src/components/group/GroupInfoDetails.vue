<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints'
import type { GroupInfoDtoResponse } from '@/types/group'
import { onMounted, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { PencilSquareIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
import GroupMemberManager from './GroupMemberManager.vue'
import GroupMemberList from './GroupMemberList.vue'
import EventsList from '../event/EventsList.vue'
import ManageCategory from '../category/ManageCategory.vue'

const route = useRoute()
const groupInfo = ref<GroupInfoDtoResponse>()
const groupId = +route.params.id!
const activeModal = ref<'update' | 'add' | null>(null)
const isLoading = ref(false)

const getGroupInfo = async () => {
  if (isLoading.value) return // Prevent concurrent calls
  
  isLoading.value = true
  try {
    const res = await groupApi.getGroupInfo(groupId)
    if (res.success) {
      groupInfo.value = res.data!
      console.log('GROUP INFO', groupInfo.value)
    }
  } catch (error) {
    console.error(error)
  } finally {
    await nextTick() // Ensure DOM updates complete
    isLoading.value = false
  }
}

const openUpdateModal = () => {
  activeModal.value = 'update'
}

const openAddModal = () => {
  activeModal.value = 'add'
}

const closeModal = () => {
  activeModal.value = null
}

const handleUpdate = async () => {
  closeModal()
  await getGroupInfo()
}

// Separate handler for category updates - only update categories, not full reload
const handleCategoryUpdate = async () => {
  if (isLoading.value || !groupInfo.value) return
  
  isLoading.value = true
  try {
    const res = await groupApi.getGroupInfo(groupId)
    if (res.success && res.data) {
      // Only update categories to prevent full re-render
      groupInfo.value.categories = res.data.categories
    }
  } catch (error) {
    console.error(error)
  } finally {
    await nextTick()
    isLoading.value = false
  }
}

onMounted(async () => {
  await getGroupInfo()
})
</script>

<template>
  <div class="relative my-10">
    <div v-if="!activeModal" class="space-y-4 border p-3 rounded-2xl">
      <h2 class="text-center font-bold text-2xl">Group overview</h2>
      <ButtonComponent v-if="groupInfo?.groupId" @click="openUpdateModal" primary md>
        <PencilSquareIcon class="h-5 w-5" /> Update group info
      </ButtonComponent>
      <div v-if="groupInfo?.isAdmin" class="flex gap-3 mb-6">
        <ButtonComponent @click="openAddModal" primary md>
          <UserPlusIcon class="h-5 w-5" /> Add member
        </ButtonComponent>
      </div>

      <div v-if="groupInfo?.members" class="space-y-4">
        <p><strong>Group title:</strong> {{ groupInfo?.groupName }}</p>
        <p><strong>Group ID:</strong> {{ groupInfo?.groupId }}</p>
        <GroupMemberList @update="getGroupInfo" :group-id="groupId" :members="groupInfo.members" />

        <p>Admin email: {{ groupInfo?.adminEmail }}</p>
      </div>
    </div>

    <div v-if="activeModal" class="fixed inset-0 bg-white dark:bg-zinc-900 z-50 p-6 overflow-y-auto">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">
            {{ activeModal === 'update' ? 'Update Group' : 'Add Member' }}
          </h2>
          <ButtonComponent @click="closeModal" secondary sm> ✕ Close </ButtonComponent>
        </div>

        <UpdateGroup 
          v-if="activeModal === 'update' && groupInfo?.groupId" 
          :members="groupInfo.members"
          :group-name="groupInfo.groupName" 
          :description="groupInfo.description!"
          :group-id-to-update="groupInfo?.groupId" 
          :is-admin="groupInfo.isAdmin"
          :group-color="groupInfo.userGroupColor!" 
          @update="handleUpdate" 
          @cancel="closeModal" 
        />

        <GroupMemberManager 
          v-if="activeModal === 'add' && groupInfo?.groupId && groupInfo.members"
          :group-id="groupInfo?.groupId" 
          :members="groupInfo.members" 
          @cancel="closeModal" 
          @added="handleUpdate" 
        />
      </div>
    </div>
  </div>

  <!-- Category Management Section -->
  <section v-if="groupInfo?.groupId">
    <ManageCategory 
      @update="handleCategoryUpdate" 
      :group-id="groupInfo.groupId" 
    />
  </section>

  <!-- Events Section - Only render when we have all required data -->
  <section v-if="groupInfo?.groupId && groupInfo?.categories && !isLoading">
    <h2 class="text-center font-bold text-2xl my-5">Events overview</h2>
    <EventsList 
      :group-categories="groupInfo.categories" 
      :group-id="groupInfo.groupId"
    />
  </section>

  <!-- Loading State -->
  <div v-if="isLoading" class="text-center py-10">
    <p class="text-zinc-500">Loading...</p>
  </div>
</template>