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
</script>

<template>
  <VueDatePicker
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="v => emit('update:modelValue', v instanceof Date ? v.toISOString() : v)"
    :dark="isDark"
    teleport="body"
  />
</template>