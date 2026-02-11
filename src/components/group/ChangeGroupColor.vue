<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints'
import { getBgColors } from '@/helpers/colors'
import { availableColors } from '@/types/colorList'
import type { UpdateUserGroupSettingsDtoRequest } from '@/types/group'
import { useToast } from 'primevue/usetoast'
import { ref, watch } from 'vue'
const toast = useToast()
const props = defineProps<{
  groupId: number
  groupColor: string
}>()
const emits = defineEmits<{
  (e: 'update'): void
}>()
const newGroupSettings = ref<UpdateUserGroupSettingsDtoRequest>({
  groupId: props.groupId,
  groupColor: props.groupColor,
})

const updateGroupColor = async (req: UpdateUserGroupSettingsDtoRequest) => {
  try {
    const res = await groupApi.updateUserGroupSettings(req)
    if (res.success) {
      toast.add({
        severity: 'success',
        summary: `You updated the group color`,
        life: 5000,
      })
      emits('update')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: `Failed to leave the group`,
      life: 5000,
    })
    console.error(error)
  }
}

watch(
  () => props.groupColor,
  (newColor) => {
    newGroupSettings.value.groupColor = newColor
  },
)
</script>
<template>
  <div class="">
    <p class="font-semibold mb-2">Choose color</p>

    <ul>
      <fieldset
        class="flex items-center justify-center gap-3"
        @change="updateGroupColor(newGroupSettings)"
      >
        <div v-for="color in availableColors" :key="color">
          <div
            :class="props.groupColor === color ? 'border-2 p-1 border-blue-600 rounded-full ' : ''"
          >
            <label class="cursor-pointer" :for="`color-${color}`">
              <input
                class="hidden"
                v-model="newGroupSettings.groupColor"
                :value="color"
                name="color"
                :id="`color-${color}`"
                type="radio"
              />
              <div :class="getBgColors(color)" class="h-5 w-5 rounded-full transition-all"></div>
            </label>
          </div>
        </div>
      </fieldset>
    </ul>
  </div>
</template>
