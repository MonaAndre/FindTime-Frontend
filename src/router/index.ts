import DashboardPage from '@/pages/dashboard-page.vue'
import HomePage from '@/pages/home-page.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/register-page.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/login-page.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage
    }
  ],
})

export default router
