<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { BellAlertIcon, PencilIcon, ShieldCheckIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
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

onMounted(async () => {
  await groupStore.initialize(groupId)
})

const handleGroupUpdate = async () => {
  await groupStore.fetchGroup(groupId)
}
</script>

<template>
  <section v-if="groupStore.currentGroup && !groupStore.isLoading">
    <EventsList @open-category-drawer="openCategoryDrawer = true"
      @open-group-info-drawer="openGroupInfoDrawer = true" />
  </section>

  <div v-if="groupStore.isLoading" class="text-center py-10">
    <p class="text-zinc-500">Loading...</p>
  </div>

  <Drawer position="right" v-model:visible="openCategoryDrawer" block-scroll header="Categories">
    <ManageCategory />
  </Drawer>

  <Drawer position="right" v-model:visible="openGroupInfoDrawer" class="!w-full md:!w-1/2" block-scroll
    header="Group Info">

    <div class="flex mt-5 relative gap-3 justify-center items-center ">
      <h3 class=" text-lg md:text-2xl font-bold text-center">{{ groupStore.currentGroup?.groupName }}</h3>

      <ButtonComponent class="md:absolute right-0" @click="showUpdateGroup = true" secondary rounded-full margin-y>
        <PencilIcon class="w-4 md:w-5" />
      </ButtonComponent>

    </div>
    <p class="flex gap-1 justify-center">
      <ShieldCheckIcon class="w-5 text-blue-700" /> {{ groupStore.currentGroup?.adminName }}
    </p>
    <p class="text-zinc-500 text-center dark:text-zinc-400" v-if="groupStore.currentGroup?.description">{{
      groupStore.currentGroup?.description }}</p>
    <div class="flex my-5 justify-center gap-5">

      <ButtonComponent rounded-full v-if="groupStore.currentGroup?.isAdmin" @click="showAddMember = true" primary
        margin-y>
        <UserPlusIcon class="h-5 w-5" />
      </ButtonComponent>

      <ButtonComponent @click="showChangeAdmin = true" primary rounded-full margin-y>
        <ShieldCheckIcon class="w-5" />
      </ButtonComponent>

      <ButtonComponent primary rounded-full margin-y>
        <BellAlertIcon class="w-5" />
      </ButtonComponent>
    </div>

    <GroupMemberList @update="handleGroupUpdate" :group-id="groupId"
      :members="groupStore.currentGroup?.members || []" />


    <LeaveGroup v-if="groupStore.currentGroup?.members" :members="groupStore.currentGroup?.members"
      :is-admin="groupStore.currentGroup.isAdmin" :group-id="groupStore.currentGroup.groupId"
      :group-name="groupStore.currentGroup.groupName" />
    <DeleteGroup :group-id="groupStore.currentGroup?.groupId"
      v-if="groupStore.currentGroup?.groupId && groupStore.currentGroup?.isAdmin" />

  </Drawer>

  <Dialog header="Edit Info" v-model:visible="showUpdateGroup">
    <UpdateGroup :members="groupStore.currentGroup?.members || []"
      :group-name="groupStore.currentGroup?.groupName || ''" :description="groupStore.currentGroup?.description || ''"
      :group-id-to-update="groupStore.currentGroup?.groupId || 0" :is-admin="groupStore.currentGroup?.isAdmin || false"
      :group-color="groupStore.currentGroup?.userGroupColor || 'zinc'" @update="handleGroupUpdate"
      @cancel="showUpdateGroup = false" />
  </Dialog>

  <Dialog header="Handle members" v-model:visible="showAddMember">

    <GroupMemberManager :group-id="groupStore.currentGroup?.groupId || 0"
      :members="groupStore.currentGroup?.members || []" @cancel="showAddMember = false" @updated="handleGroupUpdate" />
  </Dialog>

  <Dialog header="Change admin" v-model:visible="showChangeAdmin">
    <ChangeGroupAdmin v-if="groupStore.currentGroup?.isAdmin && groupStore.currentGroup.memberCount > 1"
      :members="groupStore.currentGroup.members" :group-id="groupStore.currentGroup.groupId"
      @close-modal="handleGroupUpdate" />

  </Dialog>
</template>
