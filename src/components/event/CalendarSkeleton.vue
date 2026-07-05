<template>
  <div class="p-3 animate-pulse">
    <!-- Toolbar -->
    <div class="flex items-center justify-between mb-4 px-1">
      <div class="flex gap-1">
        <div class="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div class="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div class="h-8 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>
      <div class="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      <div class="flex gap-2">
        <div class="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div class="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>
    </div>

    <!-- Weekday headers -->
    <div class="grid grid-cols-7 mb-2">
      <div
        v-for="i in 7"
        :key="i"
        class="h-5 mx-2 bg-zinc-200 dark:bg-zinc-700 rounded"
      />
    </div>

    <!-- Calendar grid — 6 rows × 7 cols -->
    <div class="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      <div
        v-for="i in 42"
        :key="i"
        class="bg-white dark:bg-zinc-900 p-2 min-h-24 flex flex-col gap-1"
      >
        <div class="h-5 w-5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        <div
          v-if="[3,5,9,12,17,19,23,27,31,35,38].includes(i)"
          class="h-4 rounded bg-zinc-100 dark:bg-zinc-800"
        />
        <div
          v-if="[5,19,31].includes(i)"
          class="h-4 rounded bg-zinc-100 dark:bg-zinc-800"
        />
      </div>
    </div>
  </div>
</template>
