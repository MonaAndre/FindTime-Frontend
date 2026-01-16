import GroupPage from '@/pages/group-page.vue';
import GroupsPage from '@/pages/groups-page.vue';
import HomePage from '@/pages/home-page.vue'
import SettingsPage from '@/pages/settings-page.vue';
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
      path: '/groups',
      name: 'groups',
      component: GroupsPage,
      meta: { requiresAuth: true },
    },

    {
      path: '/group/details/:id',
      name: 'group',
      component: GroupPage
    }

    ,
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
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
    next({ path: "/", })
  } else if (!requiresAuth && isAuthenticated && (to.name === "login" || to.name === "register")) {
    next({ name: "groups" });
  } else {
    next();
  }
})

export default router
