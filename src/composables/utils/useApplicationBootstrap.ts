import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { useUserStore } from '@/stores/user.ts'
import { useFriendsStore } from '@/stores/friends.ts'
import { useNotificationSocket } from '@/composables/services/useNotificationSocket.ts'
import { useChatStore } from '@/stores/chat.ts'
import { useChatSocket } from '@/composables/services/useChatSocket.ts'

export async function useApplicationBootstrap() {
  // validate auth
  const { isAuthenticated } = useAuthToken()
  if (!isAuthenticated()) return // Only proceed if authenticated

  // init stores
  const userStore = useUserStore()
  const friendsStore = useFriendsStore()
  const chatStore = useChatStore()

  // fetch data
  await Promise.all([
    userStore.fetchUser(),
    friendsStore.fetchFriends(),
    friendsStore.fetchIncomingFrienships(),
    friendsStore.fetchOutgoingFrienships(),
    chatStore.fetchMyChats(),
  ])

  // register sockets
  useNotificationSocket()
  useChatSocket().connect()
}
