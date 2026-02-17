<script setup lang="ts">
import NavBar from './NavBar.vue';

</script>

<template>
    <div class="relative md:grid md:grid-cols-14 min-h-screen ">
       
          <header class="fixed w-full z-10 bottom-0 md:relative md:col-span-2 bg-white dark:bg-zinc-900 ">
            <div class="mx-auto">
                <NavBar />
            </div>

        </header>
        <main class="mb-10 md:mb-0 md:col-span-12 bg-neutral-100 dark:bg-zinc-800">
            <div class="mx-auto md:max-h-screen overflow-auto">
                <RouterView />
            </div>
        </main>

      
    </div>
</template>