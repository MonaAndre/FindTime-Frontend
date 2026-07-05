<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import type { NotificationDtoResponse } from '@/types/notification'
import { formatRelativeTime } from '@/helpers/time'
import { BellIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import Popover from 'primevue/popover'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const notificationStore = useNotificationStore()
const { notifications, unreadCount } = storeToRefs(notificationStore)
const router = useRouter()

const popover = ref()

const toggle = (event: Event) => {
  popover.value.toggle(event)
}

const handleNotificationClick = (notification: NotificationDtoResponse) => {
  notificationStore.markAsRead(notification.notificationId)

  if (notification.groupId) {
    popover.value.hide()
    router.push({
      path: `/group/details/${notification.groupId}`,
      query: notification.eventId ? { eventId: String(notification.eventId) } : {},
    })
  }
}
</script>

<template>
  <div>
    <button
      type="button"
      class="relative flex items-center justify-center cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-500"
      @click="toggle"
    >
      <BellIcon class="w-5 h-5" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[1rem] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-none"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <Popover ref="popover" class="w-80">
      <div class="flex flex-col max-h-96">
        <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
          <p class="font-semibold text-sm text-zinc-900 dark:text-white">Notifications</p>
          <button
            v-if="unreadCount > 0"
            type="button"
            class="text-xs text-blue-600 hover:underline cursor-pointer"
            @click="notificationStore.markAllAsRead()"
          >
            Mark all as read
          </button>
        </div>

        <div class="overflow-auto">
          <div v-if="notifications.length === 0" class="py-8 text-center text-sm text-zinc-500">
            No notifications
          </div>

          <button
            v-for="notification in notifications"
            :key="notification.notificationId"
            type="button"
            class="w-full flex gap-2 items-start text-left px-3 py-2 border-b last:border-b-0 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
            @click="handleNotificationClick(notification)"
          >
            <span
              class="mt-1.5 w-2 h-2 rounded-full shrink-0"
              :class="notification.isRead ? 'bg-transparent' : 'bg-blue-600'"
            />
            <span class="flex-1 min-w-0">
              <p
                class="text-sm text-zinc-900 dark:text-zinc-100"
                :class="{ 'font-semibold': !notification.isRead }"
              >
                {{ notification.message }}
              </p>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {{ formatRelativeTime(notification.createdAt) }}
              </p>
            </span>
          </button>
        </div>
      </div>
    </Popover>
  </div>
</template>
