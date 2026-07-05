import { categoryApi } from '@/endpoints/categoryEndpoints'
import { eventApi } from '@/endpoints/eventEndpoints'
import { groupApi } from '@/endpoints/groupEndpoints'
import type { GetAllEventsNextWeekDtoResponse, GetAllGroupEventsResponse } from '@/types/events'
import type { Group, GroupCategoryGroupDto, GroupInfoDtoResponse } from '@/types/group'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const userGroupStore = defineStore('group', () => {
  const currentGroup = ref<GroupInfoDtoResponse | null>(null)
  const categories = ref<GroupCategoryGroupDto[]>([])
  const groups = ref<Group[]>([])
  const eventsNextWeek = ref<GetAllEventsNextWeekDtoResponse[]>([])
  const events = ref<GetAllGroupEventsResponse[]>([])
  const isLoading = ref(false)

  const groupId = computed(() => currentGroup.value?.groupId)
  const startTime = ref<Date | undefined>(undefined)
  const endTime = ref<Date | undefined>(undefined)

  const categoryMap = computed(() => {
    const map = new Map<number, GroupCategoryGroupDto>()
    categories.value.forEach((cat) => {
      map.set(cat.categoryId, cat)
    })
    return map
  })
  const eventsWithCurrentCategories = computed(() => {
    return events.value.map((event) => {
      if (event.categoryId) {
        const currentCategory = categoryMap.value.get(event.categoryId)
        if (currentCategory) {
          return {
            ...event,
            categoryColor: currentCategory.categoryColor,
            categoryName: currentCategory.categoryName,
          }
        }
      }
      return event
    })
  })

  const fetchGroup = async (id: number) => {
    isLoading.value = true
    try {
      const res = await groupApi.getGroupInfo(id)
      if (res.success && res.data) {
        currentGroup.value = res.data
        categories.value = res.data.categories || []
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchGroups = async () => {
    try {
      const res = await groupApi.getGroups()
      if (res.success && res.data) {
        groups.value = res.data
      }
    } catch (error) {
      console.error(error)
    }
  }

  const setRange = (start: Date, end: Date) => {
    startTime.value = start
    endTime.value = end
  }

  const fetchEvents = async () => {
    if (!groupId.value) return
    if (startTime.value && endTime.value) {
      const res = await eventApi.getGroupEvents(groupId.value, startTime.value, endTime.value)
      if (res.success) {
        events.value = res.data || []
      }
    }
  }

  const fetchNextWeekEvents = async () => {
    const res = await eventApi.getEventsForNextWeek()
    if (res.success) {
      eventsNextWeek.value = res.data ?? []
    }
  }

  const fetchCategories = async () => {
    if (!groupId.value) return

    const res = await categoryApi.getAllCategories(groupId.value)
    if (res.success && res.data) {
      categories.value = res.data.map((cat) => ({
        categoryId: cat.categoryId,
        categoryName: cat.categoryName!,
        categoryColor: cat.categoryColor!,
      }))
    }
  }

  const initialize = async (id: number) => {
    await fetchGroup(id)
    await fetchEvents()
  }
  return {
    currentGroup,
    categories,
    events,
    isLoading,
    groupId,
    eventsWithCurrentCategories,
    groups,
    eventsNextWeek,
    fetchGroup,
    fetchEvents,
    fetchCategories,
    initialize,
    fetchGroups,
    fetchNextWeekEvents,
    setRange,
  }
})
