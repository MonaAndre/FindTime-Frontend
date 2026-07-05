<script setup lang="ts">
import { userApi } from '@/endpoints/userEndpoints'
import type { UserDto } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import TextInput from '../reusables/TextInput.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useToast } from 'primevue/usetoast'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const saving = ref(false)

const userDetail = ref<UserDto>({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    profilePicLink: null,
    phoneNumber: null
} as UserDto)

const initials = computed(() => {
    const first = userDetail.value.firstName?.[0] ?? ''
    const last = userDetail.value.lastName?.[0] ?? ''
    return (first + last).toUpperCase() || '?'
})

const fullName = computed(() => {
    const name = `${userDetail.value.firstName} ${userDetail.value.lastName}`.trim()
    return name || 'Your profile'
})

const handleGetUser = async () => {
    try {
        const res = await userApi.getUser()
        if (res.success) {
            userDetail.value = res.data!
        }

    } catch (error) {
        console.error(error)
    }

}

const handleUpdateUser = async (req: UserDto) => {
    saving.value = true
    try {
        const res = await userApi.updateUser(req)
        if (res.success) {
            toast.add({
                severity: "success",
                summary: "User updated",
                life: 5000
            })
        }

    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Failed to update user",
            life: 5000
        })
        console.error(error);
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    handleGetUser();
})

</script>
<template>
    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 md:p-6">
        <div class="flex items-center gap-4 pb-5 mb-5 border-b border-zinc-100 dark:border-zinc-800">
            <div
                class="w-14 h-14 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold">
                {{ initials }}
            </div>
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <UserCircleIcon class="w-5 h-5 text-blue-600 shrink-0" />
                    <h2 class="font-bold text-lg truncate">{{ fullName }}</h2>
                </div>
                <p class="text-sm text-zinc-500 dark:text-zinc-400 truncate">{{ userDetail.email }}</p>
            </div>
        </div>

        <form class="flex flex-col" @submit.prevent="handleUpdateUser(userDetail)">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <TextInput type="text" name="first-name" v-model="userDetail.firstName">First name</TextInput>
                <TextInput type="text" name="last-name" v-model="userDetail.lastName">Last name</TextInput>
            </div>

            <TextInput name="email" v-model="userDetail.email" type="email">Email</TextInput>
            <TextInput name="phone-number" v-model="userDetail.phoneNumber" type="phone">Phone number</TextInput>
            <TextInput name="birthday" v-model="userDetail.birthday" type="datetime-local">Birthday</TextInput>

            <div class="flex justify-end mt-6">
                <ButtonComponent type="submit" primary lg :loading="saving">Save changes</ButtonComponent>
            </div>
        </form>
    </div>
</template>
