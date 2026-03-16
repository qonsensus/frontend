import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/types/dtos.ts'
import { useFriendsService } from '@/composables/services/useFriendsService.ts'

export const useFriendsStore = defineStore('FriendsStore', () => {
  const friends = ref<components['schemas']['FriendshipListItemDto'][]>([])
  const incomingFriendRequests = ref<components['schemas']['IncomingFrienshipRequestDto'][]>([])
  const outgoingFriendRequests = ref<components['schemas']['OutgoingFrienshipRequestDto'][]>([])

  function addIncomingFriendRequest(request: components['schemas']['IncomingFrienshipRequestDto']) {
    incomingFriendRequests.value.push(request)
  }

  function removeIncomingFriendRequest(requestId: string) {
    incomingFriendRequests.value = incomingFriendRequests.value.filter(
      (req) => req.id !== requestId,
    )
  }

  async function fetchFriends() {
    friends.value = await useFriendsService().getFriends()
  }

  async function fetchOutgoingFrienships() {
    outgoingFriendRequests.value = await useFriendsService().getOutgoingFriendRequests()
  }

  async function fetchIncomingFrienships() {
    incomingFriendRequests.value = await useFriendsService().getIncomingFriendRequests()
  }

  async function fetchAll() {
    await Promise.all([fetchFriends(), fetchOutgoingFrienships(), fetchIncomingFrienships()])
  }

  return {
    friends,
    incomingFriendRequests,
    outgoingFriendRequests,
    addIncomingFriendRequest,
    removeIncomingFriendRequest,
    fetchFriends,
    fetchOutgoingFrienships,
    fetchIncomingFrienships,
    fetchAll,
  }
})
