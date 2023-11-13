export interface FriendProps {
  id: string
  friendId: string
  username: string
  name: string
  requestedByMe: boolean
  acceptedAt: string | null
}

export interface UserProps {
  id: string
  name: string
  email: string
  username: string
  status: string | null
}
