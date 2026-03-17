import { useAuthToken } from '@/composables/utils/useAuthToken.ts'
import { useUserStore } from '@/stores/user.ts'
import { useFriendsStore } from '@/stores/friends.ts'
import { useNotificationSocket } from '@/composables/services/useNotificationSocket.ts'
import { useConversationsStore } from '@/stores/conversations.ts'

export async function useApplicationBootstrap() {
  // validate auth
  const { isAuthenticated } = useAuthToken()
  if (!isAuthenticated()) return // Only proceed if authenticated

  // init stores
  const userStore = useUserStore()
  const friendsStore = useFriendsStore()
  const conversationsStore = useConversationsStore()

  // fetch data
  await Promise.all([
    userStore.fetchUser(),
    friendsStore.fetchFriends(),
    friendsStore.fetchIncomingFrienships(),
    friendsStore.fetchOutgoingFrienships(),
    conversationsStore.fetchConversations(),
  ])

  // register socket
  useNotificationSocket()
}
