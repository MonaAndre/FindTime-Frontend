<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { ArrowLeftStartOnRectangleIcon, Cog8ToothIcon, HomeIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import LogoutIcon from '../reusables/icons/LogoutIcon.vue';
import LogoIcon from '../reusables/icons/LogoIcon.vue';

const auth = useAuthStore();

const logout = async () => {
    try {
        const result = await auth.logout();
        if (result.success) {
            console.log("Logout successful");
            router.push('/');
        }
    } catch (error) {
        console.error(error);
    }
}
</script>
<template>  
    <nav
        class="flex md:flex-col gap-5 items-center md:items-start p-3 border-t dark:border-zinc-600 border-zinc-300 md:border-r md:border-t-0 md:min-h-screen  ">
        <div class="hidden md:flex md:flex-col gap-1">
            <LogoIcon class=""></LogoIcon>
            <p class="font-bold hidden md:block lg:text-xl text-blue-400">FindTime</p>
        </div>
        <div class="flex md:flex-col grow justify-around md:items-start md:justify-start gap-10">
            <RouterLink class="inline-flex" to="/">
                <HomeIcon class="w-5 h-5 mr-2 self-center" />
                <p class="hidden md:block">Home</p>
            </RouterLink>
            <RouterLink class="inline-flex" v-if="auth.isAuthenticated" to="/groups">
                <UserGroupIcon class="w-5 h-5 mr-2 self-center" />
                <p class="hidden md:block">Groups</p>
            </RouterLink>
            <RouterLink v-if="!auth.isAuthenticated" to="/register">
                <p class="hidden md:block">Register</p>
            </RouterLink>
            <RouterLink class="inline-flex" v-if="!auth.isAuthenticated" to="/login">
                <LogoutIcon class="h-5 w-5 mr-2 self-center" />
                <p class="hidden md:block">Login</p>
            </RouterLink>

            <RouterLink class="inline-flex" v-if="auth.isAuthenticated" to="/settings">
                <Cog8ToothIcon class="h-5 w-5 mr-2 self-center" />
                <p class="hidden md:block">Settings</p>
            </RouterLink>
        </div>

        <button type="button" class="cursor-pointer inline-flex text-red-600 dark:text-red-700  bottom-3 md:absolute" v-if="auth.isAuthenticated"
            @click="logout">
            <ArrowLeftStartOnRectangleIcon class="h-5 w-5 mr-2 self-center" />
            <p class="hidden md:block">Logout</p>
        </button>
    </nav>
</template>