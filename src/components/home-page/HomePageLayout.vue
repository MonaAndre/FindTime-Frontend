<script setup lang="ts">
import { ArrowPathIcon, CalendarIcon, UserGroupIcon } from '@heroicons/vue/24/outline';
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useTheme } from '../themeSwitcher';
import router from '@/router';
import { ref } from 'vue';
const { theme: currentTheme } = useTheme()

console.log(currentTheme.value)

const scrollToMoreInfo = () => {
  document.getElementById('more-info')?.scrollIntoView({ behavior: 'smooth' })
}

const navigateToRegister = () => {
  router.push('/register')
}
const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <div class="container">
    <section class="flex items-center min-h-screen relative section">
      <div class="absolute top-10 left-20 bg-blue-300/50 dark:bg-blue-900/50 blur-3xl  w-52 h-50 z-1">blur</div>
      <div class="absolute bottom-10 right-10 bg-sky-300/50 dark:bg-sky-900/50 blur-3xl  w-132 h-80 z-1">blur</div>

      <div class="grid grid-cols-1 md:grid-cols-2 z-2">
        <div class="flex flex-col gap-3 md:gap-10 p-5">
          <span>

            <span
              class="uppercase font-bold text-blue-700 text-xs py-2 pl-9 pr-4 bg-blue-200/50 dark:bg-blue-700/30 dark:text-blue-400 rounded-full relative border border-blue-600">
              <div class="absolute left-4 top-2">
                <div class="relative flex items-center justify-center">
                  <span class="absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                  <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                </div>
              </div>

              V1.0 is out now
            </span>
          </span>
          <h1 class="text-2xl font-bold lg:text-4xl">Master Your <span
              class="font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Schedule</span>
            with FindTime</h1>
          <p>Modern and minimalist calender app for families and friend. Sync you life with other</p>
          <div class="flex justify-center gap-3 w-full">
            <ButtonComponent @click="navigateToRegister" primary margin-y lg>Get started</ButtonComponent>
            <ButtonComponent @click="scrollToMoreInfo" tertiary margin-y lg>Read more about FindTime</ButtonComponent>
          </div>

        </div>
        <div v-if="currentTheme === 'light'"
          class="rounded-4xl overflow-hidden grid place-items-center p-7 m-5 bg-neutral-200/60">
          <img src="/public/home-page.png" alt="" class="object-center" />
        </div>
        <div v-else class="rounded-4xl overflow-hidden grid place-items-center p-7 bg-neutral-400 m-5">
          <img src="/public/app-dark.png" alt="" class="" />
        </div>
      </div>
    </section>
    <section id="more-info" class="min-h-screen flex items-center justify-center section">
      <div class="p-5">
        <h2 class="text-2xl font-bold lg:text-4xl text-center">Engineered for productivity</h2>
        <p class="text-zinc-400 text-center mt-3">Discover why thousands of users chose FindTime to stay organized and
          efficient</p>
        <div class="grid  my-7 lg:grid-cols-3 gap-3">
          <div
            class=" bg-white dark:bg-gray-900 p-5 border group border-sky-800 hover:border-sky-500 transition-custom rounded-xl">
            <h3 class="flex flex-col gap-3 mb-2">
              <div
                class="rounded-full w-10 h-10 flex items-center justify-center bg-sky-500/20 group-hover:bg-sky-500 transition-custom">
                <CalendarIcon class="w-5 h-5 text-sky-400 group-hover:text-white transition-custom"></CalendarIcon>
              </div>
              <span class="font-bold text-lg">Smart event menegement</span>
            </h3>
            <p class="text-zinc-400 text-xs/6 ">blablabla blablabla blablabla blablabla blablabla</p>
          </div>
          <div
            class="bg-white dark:bg-gray-900 p-5 border group border-purple-800 hover:border-purple-500 transition-custom rounded-xl">
            <h3 class="flex flex-col gap-3 mb-2">
              <div
                class="rounded-full w-10 h-10 flex items-center justify-center bg-purple-500/20 group-hover:bg-purple-500 transition-custom">
                <UserGroupIcon class="w-5 h-5 text-purple-400 group-hover:text-white transition-custom"></UserGroupIcon>
              </div>
              <span class="font-bold text-lg">Real-time colaborations</span>
            </h3>
            <p class="text-zinc-400 text-xs/6 ">blablabla blablabla blablabla blablabla blablabla</p>
          </div>
          <div
            class=" bg-white dark:bg-gray-900 p-5 border group border-teal-800 hover:border-teal-500 transition-custom rounded-xl">
            <h3 class="flex flex-col gap-3 mb-2">
              <div
                class="rounded-full w-10 h-10 flex items-center justify-center bg-teal-500/20 group-hover:bg-teal-500 transition-custom">
                <ArrowPathIcon class="w-5 h-5 text-teal-400 group-hover:text-white transition-custom"></ArrowPathIcon>
              </div>
              <span class="font-bold text-lg">Cross-Platform Sync</span>
            </h3>
            <p class="text-zinc-400 text-xs/6 ">blablabla blablabla blablabla blablabla blablabla</p>
          </div>
        </div>
      </div>

    </section>
    <section class="min-h-screen flex items-center justify-center section">
      <div class="grid place-items-center grid-cols-1 md:grid-cols-2 gap-1 ">
        <div v-if="currentTheme === 'light'"
          class="rounded-4xl overflow-hidden grid place-items-center p-7 m-5 w-65 bg-neutral-200/60">
          <img src="/public/mobile.png" alt="" class="object-center" />
        </div>
        <div v-else class="rounded-4xl overflow-hidden grid place-items-center p-7 m-5 w-65 bg-neutral-400 ">
          <img src="/public/mobile-dark.png" alt="" class="object-center" />
        </div>
        <div class="flex flex-col gap-3 md:gap-10 p-5">

          <h1 class="text-2xl font-bold lg:text-4xl">Productivity on the go</h1>
          <p>Take your schedule with you. The FindTime mobiöe responsive and brings high-performance scheduling to your
            pocket with a notive, snappy perspective</p>
          <div class="flex justify-center gap-3 w-full">
            <ButtonComponent secondary margin-y lg>Hitta på nåt</ButtonComponent>
          </div>

        </div>

      </div>
    </section>

    <footer class="flex gap-3 justify-center text-zinc-600 dark:text-zinc-400 p-4 bg-gray-200 dark:bg-zinc-900 text-xs">
      &copy; {{ currentYear }} <p>FindTime Inc. All rights reserved</p>
    </footer>

  </div>
</template>
<style scoped>
.container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
}
</style>
