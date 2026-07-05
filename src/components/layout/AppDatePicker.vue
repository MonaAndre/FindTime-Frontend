<script setup lang="ts">
import { computed } from "vue"
import { VueDatePicker } from "@vuepic/vue-datepicker"
import { useTheme } from "../themeSwitcher"

defineProps({
  modelValue: null
})

const emit = defineEmits(["update:modelValue"])

const { theme } = useTheme()

const isDark = computed(() => theme.value === "dark")

const toLocalISOString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
</script>

<template>
  <VueDatePicker
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="v => emit('update:modelValue', v instanceof Date ? toLocalISOString(v) : v)"
    :dark="isDark"
  />
</template>