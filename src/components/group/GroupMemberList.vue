<script setup lang="ts">
import type { AddNicknameDtoRequest, GroupMemberGroupDto } from '@/types/group';
import ButtonComponent from '../reusables/ButtonComponent.vue';
import { CheckIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
import TextInput from '../reusables/TextInput.vue';
import { groupApi } from '@/endpoints/groupEndpoints';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps<{
    members: GroupMemberGroupDto[],
    groupId: number
}>()
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
                life:5000
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
</script>
<template>
    <div>
        <p class="font-semibold mb-2">Group members</p>
        <ul class="space-y-1 ">
            <li class="pl-4 flex gap-5 items-end">{{ auth.user?.firstName }} <p class="text-sm text-zinc-400">(Me)</p>
            </li>
            <li v-for="member in members.filter((me) => me.userId !== auth.user?.id)" :key="member.userId"
                class="pl-4 flex gap-5 items-end">
                <p> {{ member.firstName }}</p>
                <p class="text-sm text-zinc-400" v-if="member.nickname">({{ member.nickname }})</p>
                <TextInput v-model="request.nickname" v-if="editingUserId === member.userId && isEditing"
                    name='nickName' type="text" placeholder="Nickname"></TextInput>
                <ButtonComponent v-if="!isEditing"
                    @click="editingUserId = member.userId, isEditing = true, request.targetUserId = editingUserId"
                    secondary lg class="my-auto">
                    <PencilSquareIcon class="h-5 w-5" />
                </ButtonComponent>

                <ButtonComponent sm class="" v-if="editingUserId === member.userId"
                    @click="editingUserId = null, isEditing = false" danger>
                    <XMarkIcon class="h-5 w-5" />

                </ButtonComponent>

                <ButtonComponent @click="handleAddNickname(request)" class="" v-if="editingUserId === member.userId" sm
                    secondary>
                    <CheckIcon class="h-5 w-5" />

                </ButtonComponent>
            </li>
        </ul>
    </div>
</template>