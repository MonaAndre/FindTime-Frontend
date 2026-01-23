<script setup lang="ts">
import { ref } from 'vue'
import TextInput from '../reusables/TextInput.vue'
import type { GroupMemberGroupDto, UpdateGroupInfoDtoRequest } from '@/types/group'
import { groupApi } from '@/endpoints/groupEndpoints'
import { useToast } from 'primevue/usetoast'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import ChangeGroupAdmin from './ChangeGroupAdmin.vue'
import LeaveGroup from './LeaveGroup.vue'
import DeleteGroup from './DeleteGroup.vue'
import ChangeGroupColor from './ChangeGroupColor.vue'


const showForm = ref(false)
const toast = useToast()
const props = defineProps<{
  groupIdToUpdate: number
  groupName: string
  description: string | null
  members: GroupMemberGroupDto[]
  isAdmin: boolean,
  groupColor: string,
}>()



const updateForm = ref<UpdateGroupInfoDtoRequest>({
  groupId: props.groupIdToUpdate,
  groupName: props.groupName,
  description: props.description,
})
const emit = defineEmits<{
  (e: 'update'): void
  (e: 'cancel'): void
}>()

const handleChangeAdmin = () => {
  emit('update');
}
const updateGroup = async (request: UpdateGroupInfoDtoRequest) => {
  try {
    const res = await groupApi.updateGroupInfo(request)
    if (res.success) {
      console.log('GROUP UPDATED')
      emit('update')
      showForm.value = false
      toast.add({
        severity: 'success',
        summary: 'Updated succeded',
        life: 5000,
      })
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <section>

    <form @submit.prevent="updateGroup(updateForm)" class="form">
      <TextInput :placeholder="'Group name'" :type="'text'" :name="'group-name'" v-model="updateForm.groupName">Group
        name</TextInput>
      <TextInput :placeholder="'Group description'" :type="'text'" :name="'group-description'"
        v-model="updateForm.description">Group description</TextInput>
      <div class="flex flex-1 items-center gap-3 justify-center">
        <ButtonComponent margin-y type="submit" primary lg>Update group</ButtonComponent>
        <ButtonComponent margin-y secondary md @click="emit('cancel')">Back</ButtonComponent>
      </div>
    </form>

    <ChangeGroupColor :group-id="groupIdToUpdate" :group-color="groupColor" />
  </section>
  <ChangeGroupAdmin @close-modal="handleChangeAdmin" v-if="isAdmin" :members="members" :group-id="groupIdToUpdate" />
  <LeaveGroup v-if="groupIdToUpdate" :members="members" :is-admin="isAdmin" :group-id="groupIdToUpdate" :group-name="groupName" />
  <DeleteGroup :group-id="groupIdToUpdate" v-if="isAdmin" />
</template>
