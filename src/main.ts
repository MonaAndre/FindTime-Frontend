import './assets/main.css'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import { definePreset } from '@primevue/themes'
import ConfirmationService from 'primevue/confirmationservice'
import '@vuepic/vue-datepicker/dist/main.css'
import ToastService from 'primevue/toastservice'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import AppDatePicker from './components/layout/AppDatePicker.vue'

const AppTheme = definePreset(Lara, {
  components: {
    dialog: {
      header: {
        padding: '1.25rem 1.5rem 0.75rem 1.5rem',
      },
    },
    drawer: {
      header: {
        padding: '1.25rem 1.5rem 0.75rem 1.5rem',
      },
    },
  },
})

const app = createApp(App)
app.use(ConfirmationService)
app.use(PrimeVue, {
  theme: {
    preset: AppTheme,
    options:{
      darkModeSelector: '.my-app-dark',
    }
  },
})
app.use(ToastService)
app.use(createPinia())
app.use(router)
app.component('VueDatePicker', AppDatePicker)

app.mount('#app')
