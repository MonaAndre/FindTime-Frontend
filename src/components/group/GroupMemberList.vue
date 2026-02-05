<script setup lang="ts">
import type { AddNicknameDtoRequest, GroupMemberGroupDto } from '@/types/group';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { CheckIcon, PencilIcon, UserCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import {  computed, ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import { groupApi } from '@/endpoints/groupEndpoints';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore';
import { userGroupStore } from '@/stores/userGroupStore';

const props = defineProps<{
    members: GroupMemberGroupDto[],
    groupId: number
}>()

const groupStore = userGroupStore();
const emit = defineEmits<{
    (e: 'update'): void;
}>();
const auth = useAuthStore();
const toast = useToast();
const isEditing = ref(false);
const editingUserId = ref<string | null>(null);
const request = ref<AddNicknameDtoRequest>({
    targetUserId: editingUserId.value!,
    nickname: '',
    groupId: props.groupId
})

const handleAddNickname = async (request: AddNicknameDtoRequest) => {
    try {
        const result = await groupApi.addNickname(request);
        if (result.success) {

            toast.add({
                severity: "success",
                summary: `You added nickname successfully`,
                life: 5000
            })
            isEditing.value = false;
            editingUserId.value = null;
            request.nickname = "";
            emit("update");
        }

    } catch (error) {
        toast.add({
            severity: "error",
            summary: `Failed to add nickname`
        })
        console.error(error)
    }

}
const bgColor = computed(() => {
  const color = groupStore.currentGroup?.userGroupColor
  return color ? `bg-${color}-200` : 'bg-gray-500'
})

</script>
<template>
    <div>
        <div class="flex items-center justify-between">
            <p class="font-semibold text-xl mb-2">Group Members</p>
            <p class="rounded-full px-2 py-.5 border-2 text-sm border-blue-600 text-blue-600">{{
                groupStore.currentGroup?.memberCount }} Total</p>
        </div>

        <ul class="space-y-1 ">
            <li class="pl-4 flex gap-2 items-center">
                 <div :class=" bgColor" class="rounded-full border w-10 h-10"><img v-if="auth.user?.profilePictureLink" :src="auth.user?.profilePictureLink" > <UserCircleIcon v-else class="w-full "/></div>
                {{ auth.user?.firstName }} {{ auth.user?.lastName }} <p
                    class="text-sm text-zinc-400">(Me)</p>
                <p class="border-2 py-.5 px-2 text-blue-600 text-sm border-blue-600 ml-auto rounded-full" v-if="groupStore.currentGroup?.isAdmin">Admin</p>
            </li>
            <li v-for="member in members.filter((me) => me.userId !== auth.user?.id)" :key="member.userId"
                class="pl-4 flex gap-2 items-center">
                <div :class=" bgColor" class="rounded-full  border w-10 h-10"><img v-if="member.profilePictureLink" :src="member.profilePictureLink" >  <UserCircleIcon v-else class="w-full "/></div>
                <p> {{ member.firstName }} {{ member.lastName }}</p>
                <p class="text-sm text-zinc-400" v-if="member.nickname">({{ member.nickname }})</p>
                <TextInput v-model="request.nickname" v-if="editingUserId === member.userId && isEditing"
                    name='nickName' type="text" placeholder="Nickname"></TextInput>
                <ButtonComponent v-if="!isEditing"
                    @click="editingUserId = member.userId, isEditing = true, request.targetUserId = editingUserId"
                    rounded-full margin-y sm class="my-auto">
                    <PencilIcon class="h-4 " />
                </ButtonComponent>

                <ButtonComponent sm class="" v-if="editingUserId === member.userId"
                    @click="editingUserId = null, isEditing = false" danger>
                    <XMarkIcon class="h-5 w-5" />

                </ButtonComponent>

                <ButtonComponent @click="handleAddNickname(request)" class="" v-if="editingUserId === member.userId" sm
                    secondary>
                    <CheckIcon class="h-5 w-5" />

                </ButtonComponent>
                <p class="border-2 py-.5 px-2 text-blue-600 text-sm border-blue-600 ml-auto rounded-full" v-if="member.isAdmin">Admin</p>
            </li>
        </ul>
    </div>
</template>