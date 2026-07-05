<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import {
  ArrowLeftStartOnRectangleIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  TagIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
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
import { getBgColors } from '@/helpers/colors'

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

const groupInitial = computed(
  () => groupStore.currentGroup?.groupName?.charAt(0).toUpperCase() ?? '?',
)

const createdAtLabel = computed(() => {
  const createdAt = groupStore.currentGroup?.createdAt
  if (!createdAt) return ''
  return new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  })
})

onMounted(async () => {
  await groupStore.initialize(groupId)
})

const handleGroupUpdate = async () => {
  await groupStore.fetchGroup(groupId)
}
</script>

<template>
  <section v-if="groupStore.currentGroup && !groupStore.isLoading" class="h-full flex flex-col min-h-0">
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

    <div class="flex flex-col">
      <div class="flex items-start gap-4">
        <div
          :class="getBgColors(groupStore.currentGroup?.userGroupColor ?? 'zinc')"
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold"
        >
          {{ groupInitial }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h3 class="truncate text-xl font-bold md:text-2xl">
              {{ groupStore.currentGroup?.groupName }}
            </h3>
            <button
              type="button"
              title="Edit group"
              class="cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800"
              @click="showUpdateGroup = true"
            >
              <PencilIcon class="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
          <p class="mt-1 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <ShieldCheckIcon class="h-4 w-4 text-blue-600" />
            {{ groupStore.currentGroup?.adminName }} · Admin
          </p>
        </div>
      </div>

      <p
        v-if="groupStore.currentGroup?.description"
        class="mt-4 border-l-2 border-zinc-200 pl-3 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
      >
        {{ groupStore.currentGroup?.description }}
      </p>

      <div class="mt-5 grid grid-cols-3 gap-3">
        <div
          class="rounded-xl bg-zinc-50 px-3 py-2.5 text-center dark:bg-zinc-800/60"
        >
          <UsersIcon class="mx-auto h-4 w-4 text-zinc-400" />
          <p class="mt-1 text-base font-bold">{{ groupStore.currentGroup?.memberCount }}</p>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400">Members</p>
        </div>
        <div
          class="rounded-xl bg-zinc-50 px-3 py-2.5 text-center dark:bg-zinc-800/60"
        >
          <TagIcon class="mx-auto h-4 w-4 text-zinc-400" />
          <p class="mt-1 text-base font-bold">
            {{ groupStore.currentGroup?.categories?.length ?? 0 }}
          </p>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400">Categories</p>
        </div>
        <div
          class="rounded-xl bg-zinc-50 px-3 py-2.5 text-center dark:bg-zinc-800/60"
        >
          <CalendarDaysIcon class="mx-auto h-4 w-4 text-zinc-400" />
          <p class="mt-1 text-base font-bold">{{ createdAtLabel }}</p>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400">Created</p>
        </div>
      </div>

      <div v-if="groupStore.currentGroup?.isAdmin" class="mt-5 flex flex-wrap gap-3">
        <ButtonComponent secondary md @click="showAddMember = true">
          <UserPlusIcon class="mr-1.5 h-4 w-4" />Add member
        </ButtonComponent>
        <ButtonComponent
          v-if="groupStore.currentGroup.memberCount > 1"
          secondary
          md
          @click="showChangeAdmin = true"
        >
          <ShieldCheckIcon class="mr-1.5 h-4 w-4" />Change admin
        </ButtonComponent>
      </div>

      <div class="mt-6">
        <GroupMemberList
          @update="handleGroupUpdate"
          :group-id="groupId"
          :members="groupStore.currentGroup?.members || []"
        />
      </div>

      <div class="mt-16 border-t border-zinc-200 pt-4 dark:border-zinc-700 ">
        <p class="label-custom mb-2">Danger zone</p>
        <div class="flex flex-wrap gap-1">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            @click="showLeaveGroup = true"
          >
            <ArrowLeftStartOnRectangleIcon class="h-4 w-4" />Leave group
          </button>
          <button
            v-if="groupStore.currentGroup?.isAdmin"
            type="button"
            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            @click="showDeleteGroup = true"
          >
            <TrashIcon class="h-4 w-4" />Delete group
          </button>
        </div>
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

  <Dialog :draggable="false" class="w-full md:w-96" v-model:visible="showAddMember">
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

  <Dialog :draggable="false" class="w-full md:w-96" v-model:visible="showChangeAdmin">
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

  <Dialog :draggable="false" class="w-full md:w-96" v-model:visible="showLeaveGroup">
    <template #header>
      <div class="flex gap-3 items-center text-xl">
        <ExclamationTriangleIcon class="w-6 h-6 text-red-500" />Leave group?
      </div>
    </template>
    <p class="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
      You will be removed from this group and lose access to all shared events.
    </p>
    <div class="flex justify-end gap-3 mt-5">
      <ButtonComponent tertiary margin-y sm @click="showLeaveGroup = false">Cancel</ButtonComponent>
      <LeaveGroup />
    </div>
  </Dialog>

  <Dialog :draggable="false" class="w-full md:w-96" v-model:visible="showDeleteGroup">
    <template #header>
      <div class="flex gap-3 items-center text-xl">
        <ExclamationTriangleIcon class="w-6 h-6 text-red-500" />Delete group?
      </div>
    </template>
    <p class="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
      This permanently deletes the group and all of its data for every member.
    </p>
    <div class="flex justify-end gap-3 mt-5">
      <ButtonComponent tertiary margin-y sm @click="showDeleteGroup = false"
        >Cancel</ButtonComponent
      >
      <DeleteGroup :group-id="groupStore.currentGroup?.groupId" />
    </div>
  </Dialog>
</template>
