<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints'
import { userGroupStore } from '@/stores/userGroupStore'
import type { ChangeGroupAdminRequest, GroupMemberGroupDto } from '@/types/group'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'
import { computed, ref } from 'vue'

const toast = useToast()
const groupStore = userGroupStore()

const props = defineProps<{
  members: GroupMemberGroupDto[]
  groupId: number
}>()

const emit = defineEmits<{
  (e: 'closeModal'): void
  (e: 'updated'): void
}>()

const changeAdmin = ref<ChangeGroupAdminRequest>({
  groupId: props.groupId,
  newAdminUserId: '',
})

const newAdminName = computed(() => {
  const foundMember = props.members.find((m) => m.userId === changeAdmin.value.newAdminUserId)
  return foundMember?.firstName
})
const handleChangeAdmin = async (req: ChangeGroupAdminRequest) => {
  try {
    const result = await groupApi.changeGroupAdmin(req)

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: `Admin changed, new admin is ${newAdminName.value}`,
        life: 3000,
      })
      emit('closeModal')
      emit('updated')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: `Failed to change admin`,
      life: 3000,
    })
    console.error(error)
  }
}
</script>
<template>
  <section class="flex flex-col gap-3 w-full">
    <label class="label-custom">Choose user</label>
    <Select
      v-model="changeAdmin.newAdminUserId"
      :options="members.filter((m) => m.email !== groupStore.currentGroup?.adminEmail)"
      option-label="firstName"
      option-value="userId"
      placeholder="Select new admin"
      size="small"
      class="dark:bg-zinc-700! mb-5"
      @change="handleChangeAdmin(changeAdmin)"
    />
  </section>
</template>
