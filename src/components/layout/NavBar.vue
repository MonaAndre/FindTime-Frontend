<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
import {
  ArrowLeftStartOnRectangleIcon,
  Cog8ToothIcon,
  HomeIcon,
  UserGroupIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'
import LogoutIcon from '../reusables/icons/LogoutIcon.vue'
import LogoIcon from '../reusables/icons/LogoIcon.vue'
import ThemeSwitcher from '../menu/ThemeSwitcher.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const auth = useAuthStore()
const route = useRoute()

const isGroupsActive = computed(() => {
  return route.path === '/groups' || route.path.startsWith('/group/')
})
const logout = async () => {
  try {
    const result = await auth.logout()
    if (result.success) {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
<template>
  <nav
    class="flex md:flex-col gap-2 items-center md:items-start md:py-3 border-t dark:border-zinc-600 border-zinc-300 md:border-r md:border-t-0 md:min-h-screen"
  >
    <div class="hidden px-3 md:flex md:flex-col gap-1 mb-5">
      <LogoIcon></LogoIcon>
      <p class="font-medium hidden md:block lg:text-xl text-blue-600">FindTime</p>
    </div>
    <div
      class="flex md:flex-col w-full md:grow justify-around md:items-start md:justify-start gap-2"
    >
      <RouterLink class="flex items-center md:justify-start justify-center md:w-full p-3" to="/">
        <HomeIcon class="w-5 h-5 md:mr-2 self-center" />
        <p class="hidden md:block">Home</p>
      </RouterLink>
      <RouterLink
        :class="{ 'router-link-active': isGroupsActive }"
        class="flex items-center md:justify-start justify-center md:w-full p-3"
        v-if="auth.isAuthenticated"
        to="/groups"
      >
        <UserGroupIcon class="w-5 h-5 md:mr-2 self-center" />
        <p class="hidden md:block">Groups</p>
      </RouterLink>
      <RouterLink
        v-if="!auth.isAuthenticated"
        to="/register"
        class="flex items-center md:justify-start justify-center md:w-full p-3"
      >
        <UserPlusIcon class="h-5 w-5 md:mr-2 self-center" />
        <p class="hidden md:block">Register</p>
      </RouterLink>
      <RouterLink
        class="flex items-center md:justify-start justify-center md:w-full p-3"
        v-if="!auth.isAuthenticated"
        to="/login"
      >
        <LogoutIcon class="h-5 w-5 md:mr-2 self-center" />
        <p class="hidden md:block">Login</p>
      </RouterLink>

      <RouterLink
        class="flex items-center md:justify-start justify-center md:w-full p-3"
        v-if="auth.isAuthenticated"
        to="/settings"
      >
        <Cog8ToothIcon class="h-5 w-5 md:mr-2 self-center" />
        <p class="hidden md:block">Settings</p>
      </RouterLink>
    </div>
    <div class="flex justify-center item-center md:p-3">
      <ThemeSwitcher />
    </div>

    <button
      type="button"
      class="cursor-pointer flex p-3 text-neutral-600 dark:text-neutral-400 bottom-3 hover:text-red-400 dark:hover:text-red-500"
      v-if="auth.isAuthenticated"
      @click="logout"
    >
      <ArrowLeftStartOnRectangleIcon class="h-5 w-5 mr-2 self-center" />
      <p class="hidden md:block">Logout</p>
    </button>
  </nav>
</template>

<style scoped>
.router-link-active {
  color: #005fff;
  background-color: #d6e5ff;
  font-weight: bold;
}

.dark .router-link-active {
  color: #005fff; 
  background-color: #0b1c3b;

  font-weight: bold;
}
</style>
