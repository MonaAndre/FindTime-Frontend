<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import TextInput from '../reusables/TextInput.vue'
import { isValidEmail } from '@/helpers/validation'
import { UserPlusIcon } from '@heroicons/vue/24/outline'

const memberEmail = ref('')
const submitted = ref(false)
const emit = defineEmits<{
  (e: 'add', email: string): void
  (e: 'cancel'): void
}>()

const emailError = computed(() => {
  const email = memberEmail.value.trim()
  if (!email) return 'Email is required'
  if (!isValidEmail(email)) return 'Enter a valid email address'
  return ''
})

const handleSubmit = () => {
  submitted.value = true
  if (emailError.value) return
  emit('add', memberEmail.value.trim())
  memberEmail.value = ''
  submitted.value = false
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <TextInput
      placeholder="member@example.com"
      type="email"
      name="member-email"
      v-model="memberEmail"
      :is-valid="!(submitted && emailError)"
      :error-message="submitted ? emailError : ''"
    >
      Member email
    </TextInput>
    <div class="flex flex-1 items-center gap-3 justify-end mt-4">
      <ButtonComponent margin-y tertiary md @click="emit('cancel')">Cancel</ButtonComponent>
      <ButtonComponent margin-y md type="submit" primary>
        <UserPlusIcon class="mr-1.5 h-4 w-4" />Add member
      </ButtonComponent>
    </div>
  </form>
</template>
