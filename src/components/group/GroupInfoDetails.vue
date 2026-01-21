<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints'
import type { GroupInfoDtoResponse } from '@/types/group'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { PencilSquareIcon, UserPlusIcon } from '@heroicons/vue/24/outline'
import GroupMemberManager from './GroupMemberManager.vue'
import GroupMemberList from './GroupMemberList.vue'
const route = useRoute()
const groupInfo = ref<GroupInfoDtoResponse>()
const groupId = +route.params.id!
const activeModal = ref<'update' | 'add' | null>(null)

const getGroupInfo = async () => {
  try {
    const res = await groupApi.getGroupInfo(groupId)
    if (res.success) {
      groupInfo.value = res.data!
      console.log('GROUP INFO', groupInfo.value)
    }
  } catch (error) {
    console.error(error)
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
onMounted(async () => {
  await getGroupInfo()
})
</script>
<template>
  <div class="relative">
    <div v-if="!activeModal" class="space-y-4">
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

    <div v-if="activeModal" class="fixed inset-0 bg-white z-50 p-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">
            {{ activeModal === 'update' ? 'Update Group' : 'Add Member' }}
          </h2>
          <ButtonComponent @click="closeModal" secondary sm> ✕ Close </ButtonComponent>
        </div>

        <UpdateGroup v-if="activeModal === 'update' && groupInfo?.groupId" :members="groupInfo.members"
          :group-name="groupInfo.groupName" :description="groupInfo.description!"
          :group-id-to-update="groupInfo?.groupId" :is-admin="groupInfo.isAdmin" @update="handleUpdate"
          @cancel="closeModal" />

        <GroupMemberManager v-if="activeModal === 'add' && groupInfo?.groupId && groupInfo.members"
          :group-id="groupInfo?.groupId" :members="groupInfo.members" @cancel="closeModal" @added="handleUpdate" />
      </div>
    </div>
  </div>
</template>
