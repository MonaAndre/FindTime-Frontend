<script setup lang="ts">
import { computed, ref } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

defineOptions({
    inheritAttrs: false,
});
const props = withDefaults(defineProps<{
    type?: string,
    name: string,
    placeholder?: string,
    isValid?: boolean,
    errorMessage?: string,
    showPasswordToggle?: boolean
}>(),
    {
        type: "text",
        isValid: true,
        showPasswordToggle: false
    });

const value = defineModel<string | null>();
const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const inputType = computed(() => {

    if (props.type === 'password' && showPassword.value) {
        return 'text';
    }
    return props.type
})

</script>
<template>
    <div>
        <label class="block mb-2 text-sm/6 font-medium text-zinc-900" :for="name">
            <slot></slot>
        </label>
        <div class="relative">
            <input :id="name" :type="inputType" :placeholder="placeholder" v-model="value" v-bind="$attrs" :class="[
                'block w-full rounded-md bg-white px-3  md:text-base text-zinc-800 outline-1 -outline-offset-1 placeholder:text-zinc-400 focus:outline-2 focus:-outline-offset-2 text-sm/6',
                showPasswordToggle && type === 'password' ? 'py-1.5 pr-10' : 'py-1.5',
                !isValid ? 'outline-red-500 focus:outline-red-600' : 'outline-zinc-500 focus:outline-green-600'
            ]" />
            <button v-if="showPasswordToggle && type === 'password'" type="button" @click="togglePassword" class="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600
            focus:outline-none">
                <EyeIcon v-if="!showPassword" class="w-5 h-5 " />
                <EyeSlashIcon v-else class="w-5 h-5 " />
            </button>
            <p v-if="errorMessage" class="mt-2 text-red-500 text-sm">{{ errorMessage }}</p>
        </div>


    </div>
</template>