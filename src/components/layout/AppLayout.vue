<script setup lang="ts">
import FooterComponent from './FooterComponent.vue';
import NavBar from './NavBar.vue';

</script>

<template>
    <div class="flex flex-col min-h-screen justify-between">
        <header class=" w-full">
            <div class="container mx-auto">
                <NavBar />
            </div>
        </header>
        <main class="grow mt-3">
            <div class="container mx-auto">
                <RouterView />
            </div>
        </main>

        <footer>
            <div class="container mx-auto">
                <FooterComponent />
            </div>

        </footer>
    </div>
</template>