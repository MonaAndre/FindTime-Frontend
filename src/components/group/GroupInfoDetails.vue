<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import {
  BellAlertIcon,
  InformationCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  TagIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import GroupMemberManager from './GroupMemberManager.vue'
import GroupMemberList from './GroupMemberList.vue'
import EventsList from '../event/EventsList.vue'
import ManageCategory from '../category/ManageCategory.vue'
import Drawer from 'primevue/drawer'
import { userGroupStore } from '@/stores/userGroupStore'
import Dialog from 'primevue/dialog'
import LeaveGroup from './LeaveGroup.vue'
import DeleteGroup from './DeleteGroup.vue'
import ChangeGroupAdmin from './ChangeGroupAdmin.vue'

const route = useRoute()
const groupStore = userGroupStore()
const groupId = +route.params.id!

const openCategoryDrawer = ref(false)
const openGroupInfoDrawer = ref(false)
const showUpdateGroup = ref(false)
const showAddMember = ref(false)
const showChangeAdmin = ref(false)
const showLeaveGroup = ref(false)
const showDeleteGroup = ref(false)

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

  <Drawer position="right" v-model:visible="openCategoryDrawer" block-scroll header="Categories">
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <TagIcon class="w-6 h-6 mt-0.5 text-blue-500" />
        <p>Categories</p>
      </div>
    </template>
    <ManageCategory />
  </Drawer>

  <Drawer
    position="right"
    v-model:visible="openGroupInfoDrawer"
    class="!w-full md:!w-1/2 lg:!w-2/5"
    block-scroll
  >
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <InformationCircleIcon class="w-6 h-6 text-blue-500" />Group Info
      </div>
    </template>

    <div class="flex mt-5 relative gap-3 justify-center items-center">
      <h3 class="text-lg md:text-2xl font-bold text-center mb-2">
        {{ groupStore.currentGroup?.groupName }}
      </h3>

      <ButtonComponent
        class="md:absolute right-0"
        @click="showUpdateGroup = true"
        secondary
        rounded-full
        margin-y
      >
        <PencilIcon class="w-4 md:w-5" />
      </ButtonComponent>
    </div>
    <p class="flex gap-1 justify-center">
      <ShieldCheckIcon class="w-5 text-blue-700" /> {{ groupStore.currentGroup?.adminName }}
    </p>
    <p
      class="text-zinc-500 text-center dark:text-zinc-400 mt-2"
      v-if="groupStore.currentGroup?.description"
    >
      {{ groupStore.currentGroup?.description }}
    </p>
    <div class="flex my-3 justify-center gap-5">
      <ButtonComponent
        rounded-full
        v-if="groupStore.currentGroup?.isAdmin"
        @click="showAddMember = true"
        primary
        margin-y
      >
        <UserPlusIcon class="h-5 w-5" />
      </ButtonComponent>

      <ButtonComponent
        v-if="groupStore.currentGroup?.isAdmin"
        @click="showChangeAdmin = true"
        primary
        rounded-full
        margin-y
      >
        <ShieldCheckIcon class="w-5" />
      </ButtonComponent>

      <ButtonComponent primary rounded-full margin-y>
        <BellAlertIcon class="w-5" />
      </ButtonComponent>
    </div>

    <GroupMemberList
      @update="handleGroupUpdate"
      :group-id="groupId"
      :members="groupStore.currentGroup?.members || []"
    />

    <div class="absolute bottom-0 right-5">
      <div class="flex gap-5">
        <ButtonComponent danger sm margin-y @click="showLeaveGroup = true"
          >Leave Group</ButtonComponent
        >
        <ButtonComponent
          v-if="groupStore.currentGroup?.isAdmin"
          danger
          sm
          margin-y
          @click="showDeleteGroup = true"
          >Delete Group</ButtonComponent
        >
      </div>
    </div>
  </Drawer>

  <Dialog :draggable="false" class="w-full md:w-96" v-model:visible="showUpdateGroup">
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <PencilSquareIcon class="w-6 h-6 text-blue-500" />Edit info
      </div>
    </template>
    <UpdateGroup
      :members="groupStore.currentGroup?.members || []"
      :group-name="groupStore.currentGroup?.groupName || ''"
      :description="groupStore.currentGroup?.description || ''"
      :group-id-to-update="groupStore.currentGroup?.groupId || 0"
      :is-admin="groupStore.currentGroup?.isAdmin || false"
      :group-color="groupStore.currentGroup?.userGroupColor || 'zinc'"
      @update="handleGroupUpdate"
      @cancel="showUpdateGroup = false"
    />
  </Dialog>

  <Dialog class="w-full md:w-96" v-model:visible="showAddMember">
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <UserGroupIcon class="w-6 h-6 mt-0.5 text-blue-500" />Handle members
      </div>
    </template>
    <GroupMemberManager
      :group-id="groupStore.currentGroup?.groupId || 0"
      :members="groupStore.currentGroup?.members || []"
      @cancel="showAddMember = false"
      @updated="handleGroupUpdate"
    />
  </Dialog>

  <Dialog header="Change admin" class="w-full md:w-96" v-model:visible="showChangeAdmin">
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <ShieldExclamationIcon class="w-6 h-6 mt-0.5 text-blue-500" />Change admin
      </div>
    </template>
    <ChangeGroupAdmin
      v-if="groupStore.currentGroup?.isAdmin && groupStore.currentGroup.memberCount > 1"
      :members="groupStore.currentGroup.members"
      :group-id="groupStore.currentGroup.groupId"
      @updated="handleGroupUpdate"
      @close-modal="showChangeAdmin = false"
    />
  </Dialog>
  <Dialog header="Leave group?" class="w-full md:w-96" v-model:visible="showLeaveGroup">
    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
      You will be removed from this group and lose access to all shared events.
    </p>
    <div class="flex justify-end gap-3 mt-5">
      <ButtonComponent tertiary margin-y sm @click="showLeaveGroup = false">Cancel</ButtonComponent>
      <LeaveGroup />
    </div>
  </Dialog>

  <Dialog header="Delete group?" class="w-full md:w-96" v-model:visible="showDeleteGroup">
    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
      You will delete this group and lose all data.
    </p>
    <div class="flex justify-end gap-3 mt-5">
      <ButtonComponent tertiary margin-y sm @click="showDeleteGroup = false"
        >Cancel</ButtonComponent
      >
      <DeleteGroup :group-id="groupStore.currentGroup?.groupId" />
    </div>
  </Dialog>
</template>
