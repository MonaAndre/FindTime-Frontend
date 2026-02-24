<script setup lang="ts">
import { getBgColors, getBorderColors } from '@/helpers/colors'
import type { Component } from 'vue'
defineProps<{
  color?: string
  icon?: Component
}>()
</script>

<template>
  <span
    class="flex items-center border rounded-md text-xs uppercase font-bold py-1 px-2 w-fit"
    :class="`${getBgColors(color!)} ${getBorderColors(color!)}`"
  >
    <slot></slot>
    <component v-if="icon" :is="icon" class="flex ml-1 w-3 h-3 my-auto" />
  </span>
</template>
