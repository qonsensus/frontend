import { useApi } from '@/composables/utils/useApi.ts'
import type { components } from '@/types/dtos.ts'

export function useFriendsService() {
  async function getFriends(
    top: number = 20,
    page: number = 1,
    getAll: boolean = false,
  ): Promise<components['schemas']['FriendshipListItemDto'][]> {
    const client = useApi(true)
    const params: URLSearchParams = new URLSearchParams()
    params.set('top', top.toString())
    params.set('page', page.toString())
    params.set('getAll', getAll.toString())
    const { data } = await client(`/friends?${params.toString()}`)
      .get()
      .json<components['schemas']['FriendshipListItemDto'][]>()
    if (!data.value) throw new Error('No friends data')
    return data.value
  }

  async function getOutgoingFriendRequests(
    top: number = 20,
    page: number = 1,
  ): Promise<components['schemas']['OutgoingFrienshipRequestDto'][]> {
    const client = useApi(true)
    const params: URLSearchParams = new URLSearchParams()
    params.set('top', top.toString())
    params.set('page', page.toString())
    const { data } = await client(`/friends/outgoing?${params.toString()}`)
      .get()
      .json<components['schemas']['OutgoingFrienshipRequestDto'][]>()
    if (!data.value) throw new Error('No outgoing friend requests data')
    return data.value
  }

  async function getIncomingFriendRequests(
    top: number = 20,
    page: number = 1,
  ): Promise<components['schemas']['IncomingFrienshipRequestDto'][]> {
    const client = useApi(true)
    const params: URLSearchParams = new URLSearchParams()
    params.set('top', top.toString())
    params.set('page', page.toString())
    const { data } = await client(`/friends/incoming?${params.toString()}`)
      .get()
      .json<components['schemas']['IncomingFrienshipRequestDto'][]>()
    if (!data.value) throw new Error('No incoming friend requests data')
    return data.value
  }

  async function sendFriendRequest(
    recipientId: string,
  ): Promise<components['schemas']['Friendship']> {
    const client = useApi(true)
    const params: URLSearchParams = new URLSearchParams()
    params.set('recipientId', recipientId)
    const { data } = await client(`/friends/request?${params.toString()}`)
      .post({ recipientId })
      .json<components['schemas']['Friendship']>()
    if (!data.value) throw new Error('No friendship data')
    return data.value
  }

  async function acceptFriendRequest(
    requestId: string,
  ): Promise<components['schemas']['Friendship']> {
    const client = useApi(true)
    const { data } = await client(`/friends/request/${requestId}/accept`)
      .patch()
      .json<components['schemas']['Friendship']>()
    if (!data.value) throw new Error('No friendship data')
    return data.value
  }

  async function declineFriendRequest(
    requestId: string,
  ): Promise<components['schemas']['Friendship']> {
    const client = useApi(true)
    const { data } = await client(`/friends/request/${requestId}/decline`)
      .delete()
      .json<components['schemas']['Friendship']>()
    if (!data.value) throw new Error('No friendship data')
    return data.value
  }

  async function searchFriendsByDisplayName(
    displayName: string,
    top: number = 20,
    page: number = 1,
  ): Promise<components['schemas']['FriendshipListItemDto'][]> {
    const client = useApi(true)
    const queryParams = new URLSearchParams()
    queryParams.set('query', displayName)
    queryParams.set('top', top.toString())
    queryParams.set('page', page.toString())
    const { data } = await client(`/friends/search?${queryParams.toString()}`)
      .get()
      .json<components['schemas']['FriendshipListItemDto'][]>()
    if (!data.value) throw new Error('No friends data')
    return data.value
  }

  return {
    getFriends,
    getOutgoingFriendRequests,
    getIncomingFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    searchFriendsByDisplayName,
  }
}
