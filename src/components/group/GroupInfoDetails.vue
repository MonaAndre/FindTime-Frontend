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
import Drawer from 'primevue/drawer'

const route = useRoute()
const groupInfo = ref<GroupInfoDtoResponse>()
const groupId = +route.params.id!
const isLoading = ref(false)
const openCategoryDrawer = ref(false)
const openGroupInfoDrawer = ref(false)
const showUpdateGroup = ref(false)
const showAddMember = ref(false)

const getGroupInfo = async () => {
  if (isLoading.value) return

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
    await nextTick()
    isLoading.value = false
  }
}

// const closeModal = () => {
//   showUpdateGroup.value = false
// }

const handleUpdate = async () => {
  await getGroupInfo()
}

const handleCategoryUpdate = async () => {
  if (isLoading.value || !groupInfo.value) return

  isLoading.value = true
  try {
    const res = await groupApi.getGroupInfo(groupId)
    if (res.success && res.data) {
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
  <section
    v-if="groupInfo?.groupId && groupInfo.userGroupColor && groupInfo?.categories && !isLoading"
  >
    <EventsList
      :group-categories="groupInfo.categories"
      :group-id="groupInfo.groupId"
      :group-color="groupInfo.userGroupColor"
      @open-category-drawer="openCategoryDrawer = true"
      @open-group-info-drawer="openGroupInfoDrawer = true"
    />
  </section>

  <div v-if="isLoading" class="text-center py-10">
    <p class="text-zinc-500">Loading...</p>
  </div>

  <Drawer
    position="right"
    v-model:visible="openCategoryDrawer"
    block-scroll
    header="Category Management"
  >
    <section v-if="groupInfo?.groupId" class="flex justify-center">
      <ManageCategory  @update="handleCategoryUpdate" :group-id="groupInfo.groupId" />
    </section>
  </Drawer>

  <Drawer
    position="right"
    v-model:visible="openGroupInfoDrawer"
    class="!w-full md:!w-1/2"
    block-scroll
    header="Group Info"
  >
    <section class="flex gap-3">
      <ButtonComponent
        v-if="groupInfo?.groupId && !showAddMember && !showUpdateGroup"
        @click="showUpdateGroup = true"
        primary
        md
      >
        <PencilSquareIcon class="h-5 w-5" /> Update group info
      </ButtonComponent>

      <div v-if="groupInfo?.isAdmin" class="flex gap-3 mb-6">
        <ButtonComponent
          v-if="!showAddMember && !showUpdateGroup"
          @click="showAddMember = true"
          primary
          md
        >
          <UserPlusIcon class="h-5 w-5" /> Add member
        </ButtonComponent>
      </div>
    </section>

    <div v-if="groupInfo?.members && !showUpdateGroup && !showAddMember" class="space-y-4">
      <p><strong>Group title:</strong> {{ groupInfo?.groupName }}</p>
      <p><strong>Group ID:</strong> {{ groupInfo?.groupId }}</p>
      <GroupMemberList @update="getGroupInfo" :group-id="groupId" :members="groupInfo.members" />

      <p>Admin email: {{ groupInfo?.adminEmail }}</p>
    </div>

    <UpdateGroup
      v-if="showUpdateGroup && groupInfo?.groupId"
      :members="groupInfo.members"
      :group-name="groupInfo.groupName"
      :description="groupInfo.description!"
      :group-id-to-update="groupInfo?.groupId"
      :is-admin="groupInfo.isAdmin"
      :group-color="groupInfo.userGroupColor!"
      @update="handleUpdate"
      @cancel="showUpdateGroup = false"
    />

    <GroupMemberManager
      v-if="showAddMember && groupInfo?.groupId && groupInfo.members"
      :group-id="groupInfo?.groupId"
      :members="groupInfo.members"
      @cancel="showAddMember = false"
      @added="handleUpdate"
    />
  </Drawer>
</template>
