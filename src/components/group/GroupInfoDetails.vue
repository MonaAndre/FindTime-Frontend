<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { PencilSquareIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
import GroupMemberManager from './GroupMemberManager.vue'
import GroupMemberList from './GroupMemberList.vue'
import EventsList from '../event/EventsList.vue'
import ManageCategory from '../category/ManageCategory.vue'
import Drawer from 'primevue/drawer'
import { userGroupStore } from '@/stores/userGroupStore'

const route = useRoute()
const groupStore = userGroupStore()
const groupId = +route.params.id!

const openCategoryDrawer = ref(false)
const openGroupInfoDrawer = ref(false)
const showUpdateGroup = ref(false)
const showAddMember = ref(false)

onMounted(async () => {
  await groupStore.initialize(groupId)
})

const handleGroupUpdate = async () => {
  await groupStore.fetchGroup(groupId)
}
</script>

<template>
  <section v-if="groupStore.currentGroup && !groupStore.isLoading">
    <EventsList
      @open-category-drawer="openCategoryDrawer = true"
      @open-group-info-drawer="openGroupInfoDrawer = true"
    />
  </section>

  <div v-if="groupStore.isLoading" class="text-center py-10">
    <p class="text-zinc-500">Loading...</p>
  </div>

  <Drawer
    position="right"
    v-model:visible="openCategoryDrawer"
    block-scroll
    header="Categories"
  >
    <ManageCategory />
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
        v-if="!showAddMember && !showUpdateGroup"
        @click="showUpdateGroup = true"
        primary
        md
      >
        <PencilSquareIcon class="h-5 w-5" /> Update group info
      </ButtonComponent>

      <div v-if="groupStore.currentGroup?.isAdmin" class="flex gap-3 mb-6">
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

    <div v-if="!showUpdateGroup && !showAddMember" class="space-y-4">
      <p><strong>Group title:</strong> {{ groupStore.currentGroup?.groupName }}</p>
      <p><strong>Group ID:</strong> {{ groupStore.currentGroup?.groupId }}</p>
      <GroupMemberList
        @update="handleGroupUpdate"
        :group-id="groupId"
        :members="groupStore.currentGroup?.members || []"
      />

      <p>Admin email: {{ groupStore.currentGroup?.adminEmail }}</p>
    </div>

    <UpdateGroup
      v-if="showUpdateGroup"
      :members="groupStore.currentGroup?.members || []"
      :group-name="groupStore.currentGroup?.groupName || ''"
      :description="groupStore.currentGroup?.description || ''"
      :group-id-to-update="groupStore.currentGroup?.groupId || 0"
      :is-admin="groupStore.currentGroup?.isAdmin || false"
      :group-color="groupStore.currentGroup?.userGroupColor || 'zinc'"
      @update="handleGroupUpdate"
      @cancel="showUpdateGroup = false"
    />

    <GroupMemberManager
      v-if="showAddMember"
      :group-id="groupStore.currentGroup?.groupId || 0"
      :members="groupStore.currentGroup?.members || []"
      @cancel="showAddMember = false"
      @added="handleGroupUpdate"
    />
  </Drawer>
</template>
