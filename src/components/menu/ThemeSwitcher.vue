<script setup lang="ts">
import ToggleSwitch from 'primevue/toggleswitch'
import { useTheme } from '../themeSwitcher';

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <ToggleSwitch :modelValue="theme === 'dark'" @update:modelValue="toggleTheme" />
</template>
