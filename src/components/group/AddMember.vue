<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import TextInput from '../reusables/TextInput.vue'
const memberEmail = ref<string>()
const emit = defineEmits<{
  (e: 'add', email: string): void
  (e: 'cancel'): void
}>()

const cleanForm = () => {
  memberEmail.value = ''
}
</script>

<template>
  <form @submit.prevent="(emit('add', memberEmail ?? ''), cleanForm())">
    <TextInput placeholder="Member email" type="email" :name="`member-email`" v-model="memberEmail">
      Member email
    </TextInput>
    <div class="flex flex-1 items-center gap-3 justify-end mt-2">
      <ButtonComponent margin-y tertiary md @click="emit('cancel')">Back</ButtonComponent>
      <ButtonComponent margin-y md type="submit" primary >Add new member</ButtonComponent>
    </div>
  </form>
</template>
