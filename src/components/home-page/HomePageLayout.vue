<script setup lang="ts">
import {
  ArrowPathIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from '@heroicons/vue/24/outline';
import { StarIcon } from '@heroicons/vue/24/solid';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import ButtonComponent from '../reusables/ButtonComponent.vue'
import { useTheme } from '../themeSwitcher';
import router from '@/router';
import { onMounted, onUnmounted, ref } from 'vue';
const { theme: currentTheme } = useTheme()

const scrollToMoreInfo = () => {
  document.getElementById('more-info')?.scrollIntoView({ behavior: 'smooth' })
}

const navigateToRegister = () => {
  router.push('/register')
}
const currentYear = ref(new Date().getFullYear())

const stats = [
  { value: '10k+', label: 'events synced' },
  { value: '2.5k+', label: 'groups created' },
  { value: '4.9/5', label: 'average rating' },
]

const steps = [
  {
    icon: UserPlusIcon,
    iconBg: 'bg-blue-500/20',
    iconText: 'text-blue-500',
    title: 'Create your group',
    description:
      "Start a shared calendar for your partner, family, or friend group in seconds — no credit card, no setup headaches.",
  },
  {
    icon: CalendarDaysIcon,
    iconBg: 'bg-purple-500/20',
    iconText: 'text-purple-500',
    title: 'Add events together',
    description:
      'Everyone can add, edit and RSVP to events. No more scattered group chats trying to agree on a date.',
  },
  {
    icon: MagnifyingGlassIcon,
    iconBg: 'bg-teal-500/20',
    iconText: 'text-teal-500',
    title: 'Let FindTime find the time',
    description:
      "Our smart assistant scans everyone's calendar and instantly suggests the next slot when you're all free.",
  },
]

const testimonials = [
  {
    initials: 'EA',
    avatarBg: 'bg-blue-600',
    quote:
      "Finally, a shared calendar my partner and I actually use. We haven't double-booked a date night since.",
    name: 'Emma & Alex',
    role: 'Together 3 years',
  },
  {
    initials: 'MR',
    avatarBg: 'bg-purple-600',
    quote:
      'Our hiking group used to juggle four different chats to plan a trip. Now we just open FindTime.',
    name: 'Marcus',
    role: 'Weekend Hikers group',
  },
  {
    initials: 'PK',
    avatarBg: 'bg-teal-600',
    quote:
      "The smart time finder saved us so many \"when's everyone free?\" messages. It just works.",
    name: 'Priya',
    role: 'Book Club organizer',
  },
]

const faqs = [
  {
    q: 'Is FindTime free to use?',
    a: 'Yes. FindTime is free to use for you and every group you create — no trial, no credit card.',
  },
  {
    q: 'Can I be in more than one group?',
    a: 'Absolutely. Create as many groups as you need: one for your partner, one for your family, one for your friends.',
  },
  {
    q: 'Does everyone need to install an app?',
    a: 'No installation required. FindTime runs right in the browser and works great on both desktop and mobile.',
  },
  {
    q: 'How does the smart time finder work?',
    a: "FindTime looks across every member's events in a group and highlights the next slot where everyone is free, so you stop guessing.",
  },
]

let sections: NodeListOf<Element> = document.querySelectorAll('section')
let current = 0

const handleWheel = (e: WheelEvent) => {
  if (e.deltaY > 0) {
    current = Math.min(current + 1, sections.length - 1)
  } else {
    current = Math.max(current - 1, 0)
  }

  sections[current]?.scrollIntoView({
    behavior: 'smooth',
  })
}

onMounted(() => {
  sections = document.querySelectorAll('section')
  window.addEventListener('wheel', handleWheel)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
})
</script>

<template>
  <div class="relative">
    <div class="container-scroll">
      <section class="flex items-center min-h-screen relative section">
        <div class="absolute top-10 left-20 bg-blue-300/50 dark:bg-blue-900/50 blur-3xl  w-52 h-50 z-1">blur</div>
        <div class="absolute bottom-10 right-10 bg-sky-300/50 dark:bg-sky-900/50 blur-3xl  w-132 h-80 z-1">blur</div>

        <div class="grid grid-cols-1 md:grid-cols-2 z-2">
          <div class="flex flex-col gap-3 md:gap-8 p-5">
            <span>

              <span
                class="uppercase font-bold text-blue-700 text-xs py-2 pl-9 pr-4 bg-blue-200/50 dark:bg-blue-700/30 dark:text-blue-400 rounded-full relative border border-blue-600">
                <div class="absolute left-4 top-2">
                  <div class="relative flex items-center justify-center">
                    <span class="absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                    <span class="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                  </div>
                </div>

                V1.0 is out now
              </span>
            </span>
            <h1 class="text-2xl font-bold lg:text-4xl">Master Your <span
                class="font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Schedule</span>
              with FindTime</h1>
            <p>Stop missing the moments that matter. FindTime is the calendar app built for couples and friend groups –
              share events, sync your lives, and always know what's coming up, together.</p>
            <div class="flex justify-center gap-3 w-full">
              <ButtonComponent @click="navigateToRegister" primary margin-y lg>Get started</ButtonComponent>
              <ButtonComponent @click="scrollToMoreInfo" tertiary margin-y lg>Read more about FindTime</ButtonComponent>
            </div>

            <div class="flex flex-wrap gap-6 mt-2">
              <div v-for="stat in stats" :key="stat.label">
                <p class="text-2xl font-bold">{{ stat.value }}</p>
                <p class="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{{ stat.label }}</p>
              </div>
            </div>

          </div>
          <div v-if="currentTheme === 'light'"
            class="rounded-4xl overflow-hidden grid place-items-center p-7 m-5 bg-neutral-200/60">
            <img src="/public/home-page.png" alt="" class="object-center" />
          </div>
          <div v-else class="rounded-4xl overflow-hidden grid place-items-center p-7 bg-neutral-400 m-5">
            <img src="/public/app-dark.png" alt="" class="" />
          </div>
        </div>
      </section>
      <section id="more-info" class="min-h-screen flex items-center justify-center section">
        <div class="p-5">
          <h2 class="text-2xl font-bold lg:text-4xl text-center">Engineered for productivity</h2>
          <p class="text-zinc-400 text-center mt-3">See why FindTime is the calendar app couples and friend groups
            actually stick with.</p>
          <div class="grid  my-7 lg:grid-cols-3 gap-3">
            <div
              class=" bg-white dark:bg-gray-900 p-5 border group border-sky-800 hover:border-sky-500 transition-custom rounded-xl">
              <h3 class="flex flex-col gap-3 mb-2">
                <div
                  class="rounded-full w-10 h-10 flex items-center justify-center bg-sky-500/20 group-hover:bg-sky-500 transition-custom">
                  <CalendarIcon class="w-5 h-5 text-sky-400 group-hover:text-white transition-custom"></CalendarIcon>
                </div>
                <span class="font-bold text-lg">Smart event menegement</span>
              </h3>
              <p class="text-zinc-400 text-xs/6 ">Create one-time or recurring events, organize with color-coded
                categories, and keep your whole group in the loop – all from one clean interface.</p>
            </div>
            <div
              class="bg-white dark:bg-gray-900 p-5 border group border-purple-800 hover:border-purple-500 transition-custom rounded-xl">
              <h3 class="flex flex-col gap-3 mb-2">
                <div
                  class="rounded-full w-10 h-10 flex items-center justify-center bg-purple-500/20 group-hover:bg-purple-500 transition-custom">
                  <UserGroupIcon class="w-5 h-5 text-purple-400 group-hover:text-white transition-custom">
                  </UserGroupIcon>
                </div>
                <span class="font-bold text-lg">Real-time colaborations</span>
              </h3>
              <p class="text-zinc-400 text-xs/6 ">See changes the moment your partner or group updates the calendar. No
                more "didn't you know about that?" – everyone stays on the same page, always.</p>
            </div>
            <div
              class=" bg-white dark:bg-gray-900 p-5 border group border-teal-800 hover:border-teal-500 transition-custom rounded-xl">
              <h3 class="flex flex-col gap-3 mb-2">
                <div
                  class="rounded-full w-10 h-10 flex items-center justify-center bg-teal-500/20 group-hover:bg-teal-500 transition-custom">
                  <ArrowPathIcon class="w-5 h-5 text-teal-400 group-hover:text-white transition-custom"></ArrowPathIcon>
                </div>
                <span class="font-bold text-lg">Cross-Platform Sync</span>
              </h3>
              <p class="text-zinc-400 text-xs/6 ">FindTime works seamlessly across all your devices. Plan on your
                laptop,
                check the schedule on your phone – your calendar is always with you.</p>
            </div>
          </div>

          <div
            class="rounded-2xl border border-blue-200 dark:border-blue-900 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/30 p-6 flex flex-col md:flex-row items-center gap-6">
            <div class="rounded-full w-14 h-14 flex items-center justify-center bg-blue-600 shrink-0">
              <SparklesIcon class="w-7 h-7 text-white" />
            </div>
            <div class="text-center md:text-left">
              <h3 class="font-bold text-lg mb-1">Never ask "when are you free?" again</h3>
              <p class="text-zinc-500 dark:text-zinc-400 text-sm">FindTime's smart scheduling assistant instantly
                finds the next time everyone in your group is available – turning a week of back-and-forth texts
                into one click.</p>
            </div>
          </div>
        </div>

      </section>
      <section class="min-h-screen flex items-center justify-center section">
        <div class="p-5">
          <h2 class="text-2xl font-bold lg:text-4xl text-center">How FindTime works</h2>
          <p class="text-zinc-400 text-center mt-3">Three steps between "let's plan something" and everyone actually
            showing up.</p>

          <div class="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 my-7">
            <template v-for="(step, i) in steps" :key="step.title">
              <div class="flex flex-col items-center text-center gap-3 max-w-72">
                <span class="text-xs font-bold text-zinc-400 dark:text-zinc-600 tracking-widest">STEP {{ i + 1 }}</span>
                <div class="rounded-full w-14 h-14 flex items-center justify-center" :class="step.iconBg">
                  <component :is="step.icon" class="w-6 h-6" :class="step.iconText" />
                </div>
                <span class="font-bold text-lg">{{ step.title }}</span>
                <p class="text-zinc-400 text-xs/6">{{ step.description }}</p>
              </div>
              <ArrowRightIcon v-if="i < steps.length - 1"
                class="hidden lg:block w-6 h-6 text-zinc-300 dark:text-zinc-700 shrink-0 mt-6" />
            </template>
          </div>
        </div>
      </section>
      <section class="min-h-screen flex flex-col items-center justify-center section" >
        <div class="grid place-items-center grid-cols-1 md:grid-cols-2 gap-1 ">
          <div v-if="currentTheme === 'light'"
            class="rounded-4xl overflow-hidden grid place-items-center p-7 m-5 w-65 bg-neutral-200/60">
            <img src="/public/mobile.png" alt="" class="object-center" />
          </div>
          <div v-else class="rounded-4xl overflow-hidden grid place-items-center p-7 m-5 w-65 bg-neutral-400 ">
            <img src="/public/mobile-dark.png" alt="" class="object-center" />
          </div>
          <div class="flex flex-col gap-3 md:gap-10 p-5">

            <h1 class="text-2xl font-bold lg:text-4xl">Productivity on the go</h1>
            <p>
              Take your schedule wherever life takes you. FindTime's mobile experience is fast, responsive, and built
              for
              real life – whether you're at home, at work, or on the move.</p>
            <div class="flex justify-center gap-3 w-full mb-10">
              <ButtonComponent @click="navigateToRegister" secondary margin-y lg>Try yourself</ButtonComponent>
            </div>

          </div>

        </div>

      </section>
      <section class="min-h-screen flex items-center justify-center section">
        <div class="p-5">
          <div class="flex flex-col items-center gap-2">
            <div class="flex gap-1 text-amber-400">
              <StarIcon v-for="n in 5" :key="n" class="w-5 h-5" />
            </div>
            <h2 class="text-2xl font-bold lg:text-4xl text-center">Loved by couples and friend groups</h2>
            <p class="text-zinc-400 text-center mt-1">4.9/5 average rating from over 500 groups already planning
              together.</p>
          </div>

          <div class="grid my-7 lg:grid-cols-3 gap-5">
            <div v-for="t in testimonials" :key="t.name"
              class="bg-white dark:bg-gray-900 p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col gap-4">
              <div class="flex gap-1 text-amber-400">
                <StarIcon v-for="n in 5" :key="n" class="w-4 h-4" />
              </div>
              <p class="text-sm text-zinc-600 dark:text-zinc-300 italic">"{{ t.quote }}"</p>
              <div class="flex items-center gap-3 mt-auto">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                  :class="t.avatarBg">{{ t.initials }}</div>
                <div>
                  <p class="font-semibold text-sm">{{ t.name }}</p>
                  <p class="text-xs text-zinc-400">{{ t.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="min-h-screen flex items-center justify-center section">
        <div class="p-5 w-full max-w-3xl mx-auto flex flex-col gap-10">
          <div>
            <h2 class="text-2xl font-bold lg:text-4xl text-center">Frequently asked questions</h2>
            <p class="text-zinc-400 text-center mt-3 mb-7">Still curious? Here's what people usually ask before
              getting started.</p>
            <Accordion value="0">
              <AccordionPanel v-for="(faq, i) in faqs" :key="faq.q" :value="String(i)">
                <AccordionHeader>{{ faq.q }}</AccordionHeader>
                <AccordionContent>
                  <p class="text-sm text-zinc-500 dark:text-zinc-400">{{ faq.a }}</p>
                </AccordionContent>
              </AccordionPanel>
            </Accordion>
          </div>

          <div
            class="rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 p-8 text-center flex flex-col items-center gap-4">
            <h3 class="text-white text-2xl font-bold">Ready to stop double-booking your life?</h3>
            <p class="text-blue-100 text-sm max-w-md">Join thousands of couples and friend groups who finally know
              what's coming up – together.</p>
            <ButtonComponent @click="navigateToRegister" lg class="bg-white text-blue-700 hover:bg-blue-50">Get
              started — it's free</ButtonComponent>
          </div>
        </div>
      </section>
    </div>

    <footer
      class="flex gap-3 justify-center right-0 left-0 text-zinc-600 dark:text-zinc-400 p-4 bg-gray-200/60 dark:bg-zinc-900/60 text-xs absolute bottom-0">
      &copy; {{ currentYear }} <p>FindTime Inc. All rights reserved</p>
    </footer>


  </div>
</template>
<style scoped>
@media only screen and (min-width: 600px) {
.container-scroll {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
.section {
  height: 100vh;
  scroll-snap-align: start;
}

}

</style>
