<script setup lang="ts">
import { ref } from 'vue'
import type {
  AddNewGroupMemberRequest,
  DeleteMemberRequest,
  GroupMemberGroupDto,
} from '@/types/group'
import { groupApi } from '@/endpoints/groupEndpoints'
import { useToast } from 'primevue/usetoast'
import AddMember from './AddMember.vue'
import DeleteMembers from './DeleteMembers.vue'
const toast = useToast()
const props = defineProps<{
  groupId: number
  members: GroupMemberGroupDto[]
}>()
const emit = defineEmits<{
  (e: 'added'): void
  (e: 'cancel'): void
}>()
const membersToDelete = ref<DeleteMemberRequest>({
  userId: '',
  groupId: props.groupId,
})
const deleteMember = async (req: DeleteMemberRequest, userMail: string) => {
  try {
    const res = await groupApi.deleteMember(req)
    if (res.success) {
      toast.add({
        severity: 'success',
        summary: `${userMail} was removed`,
        life: 3000,
      })
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: `Failed to delete member`,
      detail: `${userMail} does not exist`,
    })
  }
}
const addNewMember = async (req: AddNewGroupMemberRequest) => {
  try {
    const res = await groupApi.addNewGroupMember(req)
    if (res.success) {
      console.log('USER ADDED')
      toast.add({
        severity: 'success',
        summary: `New member added`,
        detail: `${addForm.value.userEmail} was added`,
        life: 3000,
      })
      emit('added')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: `Failed to add member`,
      detail: `${addForm.value.userEmail} does not exist`,
    })
    console.error(error)
  }
}
const handleAddNewMember = async (userEmail: string) => {
  addForm.value.userEmail = userEmail
  await addNewMember(addForm.value)
}
const handleDeleteMember = async (userId: string, userMail: string) => {
  membersToDelete.value.userId = userId
  await deleteMember(membersToDelete.value, userMail)
}
const addForm = ref<AddNewGroupMemberRequest>({
  groupId: props.groupId,
  userEmail: '',
})
</script>
<template>
  <div>
    <AddMember @add="handleAddNewMember" />
    <DeleteMembers v-if="members.length > 1" :members="props.members" @remove="handleDeleteMember" />
  </div>
</template>
