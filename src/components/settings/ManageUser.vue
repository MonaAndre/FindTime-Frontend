<script setup lang="ts">
import { userApi } from '@/endpoints/userEndpoints'
import type { UserDto } from '@/types/user'
import { onMounted, ref } from 'vue'
import TextInput from '../reusables/TextInput.vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const userDetail = ref<UserDto>({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    profilePicLink: null,
    phoneNumber: null
} as UserDto)


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
    }
}

onMounted(() => {
    handleGetUser();
})

</script>
<template>
    <h2 class="form-title">Manage User Info</h2>

    <form class="form" @submit.prevent="handleUpdateUser(userDetail)">


        <TextInput type="text" name="first-name" v-model="userDetail.firstName">First name</TextInput>


        <TextInput type="text" name="last-name" v-model="userDetail.lastName">Last name
        </TextInput>


        <TextInput name="email" v-model="userDetail.email" type="email"> Email
        </TextInput>
        <TextInput name="phone-number" v-model="userDetail.phoneNumber" type="phone"> Phone number
        </TextInput>

        <TextInput name="birthday" v-model="userDetail.birthday" type="datetime-local"> Birthday</TextInput>


        <div class="flex justify-end mt-5 gap-2">

            <ButtonComponent type="submit" primary lg>Save</ButtonComponent>

        </div>

    </form>
</template>
