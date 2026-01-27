import './assets/main.css'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import ConfirmationService from 'primevue/confirmationservice'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import ToastService from 'primevue/toastservice'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ConfirmationService)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
  },
})
app.use(ToastService)
app.use(createPinia())
app.use(router)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
