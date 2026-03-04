<script setup lang="ts">
import { CalendarIcon } from '@heroicons/vue/24/outline';
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useTheme } from '../themeSwitcher';
const { theme: currentTheme } = useTheme()

console.log(currentTheme.value)
</script>

<template>
  <section class="mt-5 min-h-screen">
    <span class="uppercase p-2 bg-blue-700/30 rounded-full m-10 border border-blue-600">
      <span></span> V1.0 is out now</span
    >
    <div class="grid grid-cols-1  lg:grid-cols-2">
      <div class="">
        <h1>Master Your <span class="text-blue-700">Schedule</span> with FindTime</h1>
        <p>Modern and minimalist calender app for families and friend. Sync you life with other</p>
        <ButtonComponent primary margin-y md>Get started</ButtonComponent>
      </div>
      <div v-if="currentTheme === 'light'" class="rounded-4xl overflow-hidden p-7 bg-sky-200/60">
        <img src="/public/home-page.png" alt="" class="" />
      </div>
      <div v-else class="rounded-4xl overflow-hidden p-7 bg-gray-900">
        <img src="/public/app-dark.png" alt="" class="" />
      </div>
    </div>
  </section>
  <section class="min-h-screen">
    <h2>Engineered for productivity</h2>
    <p class="text-zinc-400">Discover why thousands of users chose FindTime to stay organized and efficient</p>
    <div class="grid lg:grid-cols-3 gap-3">
        <div class="bg-gray-900 p-3">
            <h3 class="flex flex-col gap-2">
                <span class="rounded-full p-2 bg-zinc-500 "><CalendarIcon class="w-5 h-5"></CalendarIcon></span>


            <span>Smart event menegement</span>
            </h3>
<p class="text-zinc-400">blablabla blablabla blablabla blablabla blablabla</p>
        </div>
        <div class="">Real-time colaborations</div>
        <div class="">Cross-Platform Sync</div>
    </div>
  </section>
</template>
