import './assets/main.css'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import ConfirmationService from 'primevue/confirmationservice'
import '@vuepic/vue-datepicker/dist/main.css'
import ToastService from 'primevue/toastservice'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import AppDatePicker from './components/layout/AppDatePicker.vue'

const app = createApp(App)
app.use(ConfirmationService)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
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
