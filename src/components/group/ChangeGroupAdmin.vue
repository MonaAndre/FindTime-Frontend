<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints'
import { userGroupStore } from '@/stores/userGroupStore'
import type { ChangeGroupAdminRequest, GroupMemberGroupDto } from '@/types/group'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'
import { computed, ref } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'

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
const submitted = ref(false)
const isSaving = ref(false)

const selectionError = computed(() =>
  changeAdmin.value.newAdminUserId ? '' : 'Select a member to transfer admin rights to',
)

const newAdminName = computed(() => {
  const foundMember = props.members.find((m) => m.userId === changeAdmin.value.newAdminUserId)
  return foundMember?.firstName
})

const handleChangeAdmin = async () => {
  submitted.value = true
  if (selectionError.value) return

  isSaving.value = true
  try {
    const result = await groupApi.changeGroupAdmin(changeAdmin.value)

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
  } finally {
    isSaving.value = false
  }
}
</script>
<template>
  <section class="flex w-full flex-col">
    <p class="text-sm text-zinc-600 dark:text-zinc-300">
      Transfer admin rights to another member. You will lose admin access to this group.
    </p>

    <label class="label-custom mt-5 mb-2" for="new-admin">New admin</label>
    <Select
      input-id="new-admin"
      v-model="changeAdmin.newAdminUserId"
      :options="members.filter((m) => m.email !== groupStore.currentGroup?.adminEmail)"
      option-label="firstName"
      option-value="userId"
      placeholder="Select new admin"
      size="small"
      class="dark:bg-zinc-700! w-full"
      :invalid="submitted && !!selectionError"
    />
    <p v-if="submitted && selectionError" class="mt-2 text-sm text-red-500">
      {{ selectionError }}
    </p>

    <div class="mt-6 flex justify-end gap-3">
      <ButtonComponent tertiary md @click="emit('closeModal')">Cancel</ButtonComponent>
      <ButtonComponent primary md :loading="isSaving" @click="handleChangeAdmin"
        >Transfer admin</ButtonComponent
      >
    </div>
  </section>
</template>
