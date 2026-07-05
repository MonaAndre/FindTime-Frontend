<script setup lang="ts">
import { computed, ref } from 'vue'
import TextInput from '../reusables/TextInput.vue'
import type { GroupMemberGroupDto, UpdateGroupInfoDtoRequest } from '@/types/group'
import { groupApi } from '@/endpoints/groupEndpoints'
import { useToast } from 'primevue/usetoast'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import ChangeGroupColor from './ChangeGroupColor.vue'

const toast = useToast()
const props = defineProps<{
  groupIdToUpdate: number
  groupName: string
  description: string | null
  members: GroupMemberGroupDto[]
  isAdmin: boolean
  groupColor: string
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

const submitted = ref(false)
const isSaving = ref(false)

const nameError = computed(() => {
  const name = updateForm.value.groupName?.trim() ?? ''
  if (!name) return 'Group name is required'
  if (name.length > 50) return 'Group name must be 50 characters or less'
  return ''
})

const descriptionError = computed(() => {
  const description = updateForm.value.description?.trim() ?? ''
  if (description.length > 200) return 'Description must be 200 characters or less'
  return ''
})

const handleSubmit = async () => {
  submitted.value = true
  if (nameError.value || descriptionError.value) return

  isSaving.value = true
  try {
    const res = await groupApi.updateGroupInfo({
      groupId: updateForm.value.groupId,
      groupName: updateForm.value.groupName.trim(),
      description: updateForm.value.description?.trim() || null,
    })
    if (res.success) {
      emit('update')
      emit('cancel')
      toast.add({
        severity: 'success',
        summary: 'Group updated',
        life: 5000,
      })
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Failed to update group',
      life: 5000,
    })
    console.error(error)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section>
    <form id="update-group-form" novalidate @submit.prevent="handleSubmit">
      <TextInput
        placeholder="Group name"
        type="text"
        name="group-name"
        v-model="updateForm.groupName"
        :is-valid="!(submitted && nameError)"
        :error-message="submitted ? nameError : ''"
        >Group name</TextInput
      >
      <TextInput
        placeholder="Group description"
        type="text"
        name="group-description"
        v-model="updateForm.description"
        :is-valid="!(submitted && descriptionError)"
        :error-message="submitted ? descriptionError : ''"
        >Group description</TextInput
      >
    </form>

    <div class="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-700">
      <ChangeGroupColor
        :group-id="groupIdToUpdate"
        :group-color="groupColor"
        @update="emit('update')"
      />
    </div>

    <div class="mt-6 flex items-center justify-end gap-3">
      <ButtonComponent tertiary md @click="emit('cancel')">Cancel</ButtonComponent>
      <ButtonComponent type="submit" form="update-group-form" :loading="isSaving" primary md
        >Save changes</ButtonComponent
      >
    </div>
  </section>
</template>
