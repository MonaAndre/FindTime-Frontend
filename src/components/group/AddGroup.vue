<script setup lang="ts">
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { ref, watch } from 'vue'
import type { CreateGroup, CreateGroupDtoResponse } from '@/types/group'
import TextInput from '../reusables/TextInput.vue'
import { groupApi } from '@/endpoints/groupEndpoints'
import Dialog from 'primevue/dialog'
const showForm = ref(false)
const newMembersEmails = ref<string[]>([''])
const groupResponse = ref<CreateGroupDtoResponse>()
const showFailedEmails = ref(false);

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
      createGroupForm.value = {
        description: null,
        groupName: '',
        membersEmails: [],
      }
      newMembersEmails.value=[""];
      groupResponse.value = response.data!
      if (groupResponse.value.failedEmails.length > 0) {
        showFailedEmails.value = true;
      }
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
    <ButtonComponent end margin-y @click="showForm = true" lg secondary>
      <PlusIcon class="h-5 w-5" />Create group
    </ButtonComponent>
  </div>
  <Dialog header="Add new group" class="w-lg" v-model:visible="showForm">

    <form class="" @submit.prevent="createGroup">
      <TextInput :placeholder="'Group name'" :type="'text'" :name="'group-name'" v-model="createGroupForm.groupName">
        Group name</TextInput>
      <TextInput :placeholder="'Group description'" :type="'text'" :name="'group-description'"
        v-model="createGroupForm.description">Group name</TextInput>
      <div v-for="(email, index) in newMembersEmails" :key="index" class="flex gap-2 items-end">
        <TextInput placeholder="Member email" type="email" :name="`member-email-${index}`"
          v-model="newMembersEmails[index]">
          Member email
        </TextInput>
        <button v-if="newMembersEmails.length > 1" type="button" @click="removeEmailField(index)">
          <TrashIcon class=" w-6 mb-2 cursor-pointer  hover:scale-125 ease-in-out hover:text-red-500 transition-all" />
        </button>
      </div>
      <ButtonComponent tertiary margin-y sm type="button" @click="addEmailField">
        <PlusIcon class="h-4 w-4" />
        Add another email
      </ButtonComponent>
      <div class="flex justify-end gap-3">
        <ButtonComponent @click="showForm = false" lg tertiary>Cancel</ButtonComponent>

        <ButtonComponent type="submit" primary lg>Create group</ButtonComponent>
      </div>
    </form>
  </Dialog>

  <Dialog header="Failed emails" v-model:visible="showFailedEmails">

    <h3>
      Group created but some members were not created because some emails are not registered
    </h3>
    <ul>
      <li v-for="failedEmail in groupResponse?.failedEmails" :key="failedEmail">
        {{ failedEmail }}
      </li>
    </ul>
    <ButtonComponent margin-y end lg secondary @click="showFailedEmails = false">Continue</ButtonComponent>
  </Dialog>
</template>
