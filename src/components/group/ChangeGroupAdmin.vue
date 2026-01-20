<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints';
import type { ChangeGroupAdminRequest, GroupMemberGroupDto } from '@/types/group';
import { useToast } from 'primevue/usetoast';
import { computed, ref } from 'vue';

const toast = useToast();

const props = defineProps<{
    members: GroupMemberGroupDto[],
    groupId: number
}>();


const changeAdmin = ref<ChangeGroupAdminRequest>({
    groupId: props.groupId,
    newAdminUserId: ""
})

const newAdminName = computed(() => {
    const foundMember = props.members.find(m => m.userId === changeAdmin.value.newAdminUserId);
    return foundMember?.firstName
})
const handleChangeAdmin = async (req: ChangeGroupAdminRequest) => {
    try {
        const result = await groupApi.changeGroupAdmin(req);

        if (result.success) {
            toast.add({
                severity: "success",
                summary: `Admin changed, new admin is ${newAdminName.value}`
            })
        }
    } catch (error) {
        toast.add({
            severity: "error",
            summary: `Failed to change admin`

        })
        console.error(error);
    }
}
</script>
<template>

    <section>
        <h3>Change admin</h3>

        <select class="border p-2 rounded-md" v-model="changeAdmin.newAdminUserId" @change="handleChangeAdmin(changeAdmin)">
            <option v-for="member in members" :value="member.userId" :key="member.userId">{{ member.email }}</option>
        </select>

    </section>


</template>