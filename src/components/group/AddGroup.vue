<script setup lang="ts">
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { ref, watch } from 'vue'
import type { CreateGroup, CreateGroupDtoResponse } from '@/types/group'
import TextInput from '../reusables/TextInput.vue'
import { groupApi } from '@/endpoints/groupEndpoints'
const showForm = ref(false)
const newMembersEmails = ref<string[]>([''])
const groupResponse = ref<CreateGroupDtoResponse>()

const addEmailField = () => {
  newMembersEmails.value.push('')
}
const removeEmailField = (index: number) => {
  newMembersEmails.value.splice(index, 1)
}
const createGroupForm = ref<CreateGroup>({
  description: null,
  groupName: '',
  membersEmails: [],
})

const emit = defineEmits<{
  (e: 'create'): void
}>()

const createGroup = async () => {
  try {
    const response = await groupApi.createGroup(createGroupForm.value)
    console.log(createGroupForm.value)
    if (response.success) {
      console.log('Group created')

      emit('create')
      showForm.value = false
      groupResponse.value = response.data!
    }
  } catch (error) {
    console.error(error)
  }
}
watch(
  newMembersEmails,
  (val) => {
    createGroupForm.value.membersEmails = val.filter((e) => e.trim() !== '')
  },
  { deep: true },
)
</script>

<template>
  <div>
    <ButtonComponent @click="showForm = true" lg secondary>
      <PlusIcon class="h-5 w-5" />Add group
    </ButtonComponent>

    <div v-if="showForm">
      <form class="form" @submit.prevent="createGroup">
        <TextInput
          :placeholder="'Group name'"
          :type="'text'"
          :name="'group-name'"
          v-model="createGroupForm.groupName"
          >Group name</TextInput
        >
        <TextInput
          :placeholder="'Group description'"
          :type="'text'"
          :name="'group-description'"
          v-model="createGroupForm.description"
          >Group name</TextInput
        >
        <div
          v-for="(email, index) in newMembersEmails"
          :key="index"
          class="flex gap-2 items-center"
        >
          <TextInput
            placeholder="Member email"
            type="email"
            :name="`member-email-${index}`"
            v-model="newMembersEmails[index]"
          >
            Member email
          </TextInput>
          <button v-if="newMembersEmails.length > 1" type="button" @click="removeEmailField(index)">
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
        <ButtonComponent tertiary sm type="button" @click="addEmailField">
          <PlusIcon class="h-4 w-4" />
          Add another email
        </ButtonComponent>
        <ButtonComponent type="submit" primary lg center>Create group</ButtonComponent>
      </form>
    </div>
    <div v-if="groupResponse?.failedEmails.length! > 0">
      <h3>
        Group created but some members were not created because some emails are not registered
      </h3>
      <ul>
        <li v-for="failedEmail in groupResponse?.failedEmails" :key="failedEmail">
          {{ failedEmail }}
        </li>
      </ul>
    </div>
  </div>
</template>
