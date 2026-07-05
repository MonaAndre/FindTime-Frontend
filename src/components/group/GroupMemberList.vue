<script setup lang="ts">
import type { AddNicknameDtoRequest, GroupMemberGroupDto } from '@/types/group'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { PencilIcon, PencilSquareIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'
import TextInput from '../reusables/TextInput.vue'
import { groupApi } from '@/endpoints/groupEndpoints'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/authStore'
import { userGroupStore } from '@/stores/userGroupStore'
import { getBgColors } from '@/helpers/colors'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  members: GroupMemberGroupDto[]
  groupId: number
}>()

const groupStore = userGroupStore()
const emit = defineEmits<{
  (e: 'update'): void
}>()
const auth = useAuthStore()
const toast = useToast()
const showAddNickName = ref(false)
const selectedMember = ref<GroupMemberGroupDto>()
const nicknameSubmitted = ref(false)
const request = ref<AddNicknameDtoRequest>({
  targetUserId: '',
  nickname: '',
  groupId: props.groupId,
})

const nicknameError = computed(() => {
  const nickname = request.value.nickname.trim()
  if (!nickname) return 'Nickname is required'
  if (nickname.length > 30) return 'Nickname must be 30 characters or less'
  return ''
})

const openNicknameDialog = (member: GroupMemberGroupDto) => {
  selectedMember.value = member
  request.value.targetUserId = member.userId
  request.value.nickname = member.nickname ?? ''
  nicknameSubmitted.value = false
  showAddNickName.value = true
}

const handleAddNickname = async () => {
  nicknameSubmitted.value = true
  if (nicknameError.value) return
  try {
    const result = await groupApi.addNickname({
      ...request.value,
      nickname: request.value.nickname.trim(),
    })
    if (result.success) {
      toast.add({
        severity: 'success',
        summary: `Nickname saved for ${selectedMember.value?.firstName}`,
        life: 3000,
      })
      request.value.nickname = ''
      nicknameSubmitted.value = false
      emit('update')
      showAddNickName.value = false
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: `Failed to add nickname`,
      life: 3000,
    })
    console.error(error)
  }
}

const avatarBg = computed(() => getBgColors(groupStore.currentGroup?.userGroupColor ?? 'zinc'))
</script>
<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <p class="text-lg font-semibold">Members</p>
      <p
        class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
      >
        {{ groupStore.currentGroup?.memberCount }} total
      </p>
    </div>

    <ul class="divide-y divide-zinc-200 dark:divide-zinc-800">
      <li class="flex items-center gap-3 py-3">
        <div
          :class="avatarBg"
          class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
        >
          <img
            v-if="auth.user?.profilePictureLink"
            :src="auth.user?.profilePictureLink"
            class="h-full w-full object-cover"
          />
          <UserCircleIcon v-else class="h-8 w-8 text-zinc-500 dark:text-zinc-300" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">
            {{ auth.user?.firstName }} {{ auth.user?.lastName }}
            <span class="text-sm font-normal text-zinc-400">(Me)</span>
          </p>
        </div>
        <p
          v-if="groupStore.currentGroup?.isAdmin"
          class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
        >
          Admin
        </p>
      </li>
      <li
        v-for="member in members.filter((me) => me.userId !== auth.user?.id)"
        :key="member.userId"
        class="flex items-center gap-3 py-3"
      >
        <div
          :class="avatarBg"
          class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
        >
          <img
            v-if="member.profilePictureLink"
            :src="member.profilePictureLink"
            class="h-full w-full object-cover"
          />
          <UserCircleIcon v-else class="h-8 w-8 text-zinc-500 dark:text-zinc-300" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate font-medium">
            {{ member.firstName }} {{ member.lastName }}
            <span v-if="member.nickname" class="text-sm font-normal text-zinc-400"
              >({{ member.nickname }})</span
            >
          </p>
        </div>
        <button
          type="button"
          :title="`Edit nickname for ${member.firstName}`"
          class="cursor-pointer rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800"
          @click="openNicknameDialog(member)"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <p
          v-if="member.isAdmin"
          class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
        >
          Admin
        </p>
      </li>
    </ul>
  </div>
  <Dialog :draggable="false" class="w-full md:w-96" v-model:visible="showAddNickName">
    <template #header>
      <div class="flex gap-4 items-center text-xl">
        <PencilSquareIcon class="w-6 h-6 text-blue-500" />Nickname for
        {{ selectedMember?.firstName }}
      </div>
    </template>
    <form novalidate @submit.prevent="handleAddNickname">
      <TextInput
        v-model="request.nickname"
        placeholder="Cute name"
        name="nickName"
        type="text"
        :is-valid="!(nicknameSubmitted && nicknameError)"
        :error-message="nicknameSubmitted ? nicknameError : ''"
        >Nickname</TextInput
      >

      <div class="flex gap-3 mt-5 justify-end">
        <ButtonComponent md @click="showAddNickName = false" tertiary> Cancel </ButtonComponent>
        <ButtonComponent type="submit" md primary> Save </ButtonComponent>
      </div>
    </form>
  </Dialog>
</template>
