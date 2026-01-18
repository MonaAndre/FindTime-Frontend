<script setup lang="ts">
import { groupApi } from '@/endpoints/groupEndpoints'
import type { GroupInfoDtoResponse } from '@/types/group'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import UpdateGroup from './UpdateGroup.vue'
const route = useRoute()
const groupInfo = ref<GroupInfoDtoResponse>()
const groupId = +route.params.id!

const getGroupInfo = async () => {
  try {
    const res = await groupApi.getGroupInfo(groupId)
    if (res.success) {
      groupInfo.value = res.data!
      console.log('GROUP INFO', groupInfo.value)
    }
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  getGroupInfo()
})
</script>
<template>
  <UpdateGroup
    v-if="groupInfo?.groupId"
    class="mb-2"
    :group-name="groupInfo.groupName"
    :description="groupInfo.description!"
    :group-id-to-update="groupInfo?.groupId"
    @update="getGroupInfo()"
  />
  <p>group title: {{ groupInfo?.groupName }}</p>
  <p>group id: {{ groupInfo?.groupId }}</p>
  <div>
    <p>group members</p>
    <ul v-for="member in groupInfo?.members" :key="member.userId">
      <li>{{ member.firstName }}</li>
    </ul>
  </div>
</template>
