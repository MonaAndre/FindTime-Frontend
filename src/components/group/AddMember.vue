<script setup lang="ts">
import { ref } from 'vue'
import ButtonComponent from '../reusables/ButtonComponent.vue'
import TextInput from '../reusables/TextInput.vue'
const memberEmail = ref<string>()
const emit = defineEmits<{
  (e: 'add', email: string): void
  (e: 'cancel'): void
}>()

const cleanForm=()=>{
  memberEmail.value="";
}
</script>

<template>
  <h3>Add member</h3>
  <form @submit.prevent="emit('add', memberEmail ?? ''), cleanForm()" class="">
    <TextInput placeholder="Member email" type="email" :name="`member-email`" v-model="memberEmail">
      Member email
    </TextInput>
    <div class="flex flex-1 items-center gap-3 justify-center">
      <ButtonComponent margin-y type="submit" primary lg>Add new member</ButtonComponent>
      <ButtonComponent margin-y secondary md @click="emit('cancel')">Back</ButtonComponent>
    </div>
  </form>
</template>
