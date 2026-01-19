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
    marginY?:boolean;
    marginX?:boolean;
}>();
</script>
<template>
    <div :class="[{
        'text-center': center,
        'text-end': end,
        'text-start': start,
        'my-3': marginY,
        'mx-3':marginX
        
    }]" >
        <button :type="type || 'button'" :class="[
            {
                'px-2 py-1 text-sm': sm,
                'px-2.5 py-1.5 text-sm': md,
                'px-3 py-2 text-sm': lg,
                'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-actgreen-light':
                    primary,
                'bg-white  text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-actblue-dark':
                    secondary,
                'bg-red-500 text-white hover:bg-white hover:border-2 hover:border-red-500 hover:text-red-500 focus-visible:outline-red-500':
                    danger,

                'bg-gray-300 text-gray-700 hover:bg-gray-400 focus-visible:outline-gray-400 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:focus-visible:outline-neutral-600':
                    tertiary,
                'pointer-events-none cursor-not-allowed opacity-50': disabled,
                'pointer-events-none cursor-not-allowed': loading,
            },
        ]" :disabled="disabled"
            class="inline-flex items-center cursor-pointer justify-center rounded font-semibold shadow-sm transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            <span v-if="loading">
                <ArrowPathIcon class="text-gray-50 h-4 w-4 animate-spin mx-0.5" />
            </span>
            <slot></slot>
        </button>

    </div>
</template>
