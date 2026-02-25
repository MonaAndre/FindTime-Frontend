<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

defineProps<{
    sm?: boolean;
    md?: boolean;
    lg?: boolean;
    primary?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    danger?: boolean;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
    center?: boolean;
    start?: boolean;
    end?: boolean;
    marginY?: boolean;
    marginX?: boolean;
    roundedFull?: boolean
}>();
</script>
<template>

    <button :type="type || 'button'" :class="[
        {
            'text-sm py-1 px-1': sm,
            'px-2.5 py-1.5 text-sm': md,
            'px-3 py-2 text-sm': lg,
            'p-2':roundedFull,
            'bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-500 ':
                primary,
            ' text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white ':
                secondary,
            ' text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white ': danger,

            'bg-gray-300 text-gray-700 border-2 border-gray-300 dark:border-neutral-700 hover:bg-gray-400 focus-visible:outline-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600 dark:focus-visible:outline-neutral-600':
                tertiary,
            'pointer-events-none cursor-not-allowed opacity-50': disabled,
            'pointer-events-none cursor-not-allowed': loading,
            'my-3': marginY,
            'mx-3': marginX,
            'rounded-full': roundedFull,
            'rounded-xl': !roundedFull
        },
    ]" :disabled="disabled"
        class="inline-flex items-center cursor-pointer justify-center  font-semibold   focus-visible:outline-2 focus-visible:outline-offset-2">
        <span v-if="loading">
            <ArrowPathIcon class="text-gray-50 h-4 w-4 animate-spin mx-0.5" />
        </span>
        <slot></slot>
    </button>
</template>
