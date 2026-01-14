import DashboardPage from '@/pages/dashboard-page.vue'
import HomePage from '@/pages/home-page.vue'
import { useAuthStore } from '@/stores/authStore';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/register-page.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/login-page.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true }
    }
  ],
});

router.beforeEach(async (to, from, next) => {

  const authStore = useAuthStore();
  if (!authStore.isInitialized) {
    await authStore.checkAuth();
  }
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated
  

  if (requiresAuth && !isAuthenticated) {
    next({ path: "/",})
  } else if (!requiresAuth && isAuthenticated && (to.name === "login" || to.name === "register")) {
    next({ name: "dashboard" });
  } else {
    next();
  }
})

export default router
