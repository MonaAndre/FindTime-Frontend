<script setup lang="ts">
import FooterComponent from './FooterComponent.vue';
import NavBar from './NavBar.vue';

</script>

<template>
    <div class="flex flex-col min-h-screen justify-between">
        <header class="fixed w-full z-20">
            <div class="container mx-auto">
                <NavBar />
            </div>
        </header>
        <main class="grow mt-15">
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