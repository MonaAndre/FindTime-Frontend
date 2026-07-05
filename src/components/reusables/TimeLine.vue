<script setup lang="ts">
defineProps<{
  startDate: string
  endDate: string
}>()

const formatDate = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
</script>
<template>
  <div class="w-full">
    <div class="flex gap-x-3">
      <div
        class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:-translate-x-[0.5px] after:border-s after:border-zinc-200 dark:after:border-zinc-700"
      >
        <div class="relative z-10 size-7 flex justify-center items-center">
          <div class="size-2.5 rounded-full bg-transparent border-2 border-blue-500"></div>
        </div>
      </div>

      <!-- Right Content -->
      <div class="grow pt-0.5 pb-8">
        <p class="text-sm font-bold mb-2">Start Time</p>
        <p class="flex gap-x-1.5 font-medium text-xs text-zinc-600 dark:text-zinc-400">
          {{ formatDate(startDate) }}
        </p>
      </div>
    </div>

    <!-- Item -->
    <div class="flex gap-x-3">
      <div>
        <div class="relative z-10 size-7 flex justify-center items-center">
          <div class="size-2.5 rounded-full bg-transparent border-2 border-red-500"></div>
        </div>
      </div>
      <!-- End Icon -->

      <!-- Right Content -->
      <div class="grow pt-0.5">
         <p class="text-sm font-bold mb-2">End Time</p>
        <p class="flex gap-x-1.5 font-medium text-xs text-zinc-600 dark:text-zinc-400">
          {{ formatDate(endDate) }}
        </p>
      </div>
      <!-- End Right Content -->
    </div>
  </div>
</template>
