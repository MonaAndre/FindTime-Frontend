import { categoryApi } from '@/endpoints/categoryEndpoints'
import { eventApi } from '@/endpoints/eventEndpoints'
import { groupApi } from '@/endpoints/groupEndpoints'
import type { GetAllGroupEventsResponse } from '@/types/events'
import type { GroupCategoryGroupDto, GroupInfoDtoResponse } from '@/types/group'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const userGroupStore = defineStore('group', () => {
  const currentGroup = ref<GroupInfoDtoResponse | null>(null)
  const categories = ref<GroupCategoryGroupDto[]>([])
  const events = ref<GetAllGroupEventsResponse[]>([])
  const isLoading = ref(false)

  const groupId = computed(() => currentGroup.value?.groupId)

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

  const fetchEvents = async () => {
    if (!groupId.value) return

    const res = await eventApi.getGroupEvents(groupId.value)
    if (res.success) {
      events.value = res.data || []
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

    fetchGroup,
    fetchEvents,
    fetchCategories,
    initialize,
  }
})
