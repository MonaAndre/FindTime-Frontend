<script setup lang="ts">
import ChangePassword from '../settings/ChangePassword.vue';
import DangerZone from '../settings/DangerZone.vue';
import ManageUser from '../settings/ManageUser.vue';
</script>

<template>
    <section
        class="flex justify-between items-center px-3 py-3 md:py-4 border-b dark:border-zinc-600 border-zinc-300 bg-white dark:bg-zinc-900">
        <div>
            <p class="font-bold text-lg">Settings</p>
            <p class="text-xs text-zinc-500 dark:text-zinc-400">Manage your profile, security and account</p>
        </div>
    </section>

    <div class="max-w-2xl mx-auto w-full flex flex-col gap-6 p-4 md:p-6">
        <ManageUser />
        <ChangePassword />
        <DangerZone />
    </div>
</template>
