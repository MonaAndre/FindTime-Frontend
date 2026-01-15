<script setup lang="ts">
import type { Group } from '@/types/group';

const props = defineProps<Group>();
</script>
<template>
    <h2>{{ props.groupName }}</h2>
    <p>Id: {{ props.groupId }}</p>
</template>