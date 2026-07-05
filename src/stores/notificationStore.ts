import { notificationApi } from '@/endpoints/notificationEndpoints'
import connection, {
  startNotificationConnection,
  stopNotificationConnection,
} from '@/plugins/signalr'
import type { NotificationDtoResponse } from '@/types/notification'
import { defineStore } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationDtoResponse[]>([])
  const unreadCount = ref(0)
  const isConnected = ref(false)
  const toast = useToast()

  const fetchNotifications = async () => {
    const res = await notificationApi.getNotifications()
    if (res.success && res.data) {
      notifications.value = res.data
    }
  }

  const fetchUnreadCount = async () => {
    const res = await notificationApi.getUnreadCount()
    if (res.success && res.data != null) {
      unreadCount.value = res.data
    }
  }

  const markAsRead = async (notificationId: number) => {
    const notification = notifications.value.find((n) => n.notificationId === notificationId)
    if (!notification || notification.isRead) return

    notification.isRead = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)

    const res = await notificationApi.markAsRead({ notificationId })
    if (!res.success) {
      notification.isRead = false
      unreadCount.value += 1
    }
  }

  const markAllAsRead = async () => {
    const previous = notifications.value.map((n) => ({ ...n }))
    notifications.value.forEach((n) => (n.isRead = true))
    unreadCount.value = 0

    const res = await notificationApi.markAllAsRead()
    if (!res.success) {
      notifications.value = previous
      await fetchUnreadCount()
    }
  }

  const handleReceiveNotification = (notification: NotificationDtoResponse) => {
    notifications.value.unshift(notification)
    unreadCount.value += 1

    toast.add({ severity: 'info', summary: notification.message, life: 3000 })
  }

  const connect = async () => {
    if (!isConnected.value) {
      connection.on('ReceiveNotification', handleReceiveNotification)
      isConnected.value = true
    }
    await startNotificationConnection()
    await Promise.all([fetchNotifications(), fetchUnreadCount()])
  }

  const disconnect = async () => {
    connection.off('ReceiveNotification', handleReceiveNotification)
    isConnected.value = false
    notifications.value = []
    unreadCount.value = 0
    await stopNotificationConnection()
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    connect,
    disconnect,
  }
})
