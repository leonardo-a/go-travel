import { Friend, Prisma } from '@prisma/client'

export interface FriendsFetchManyParams {
  userId: string
  received?: boolean
  accepted: boolean
  query: string
  page: number
}

export interface FriendUser {
  id: string
  requestedBy: string
  name: string
  acceptedAt: Date
}

export interface FriendsRepository {
  create(data: Prisma.FriendUncheckedCreateInput): Promise<Friend>

  findById(id: string): Promise<Friend | null>

  fetchMany(params: FriendsFetchManyParams): Promise<Friend[]>

  fetchByIds(userId: string, friendsIds: string[]): Promise<Friend[]>

  findUnique(userId: string, friendId: string): Promise<Friend | null>

  save(friend: Friend): Promise<Friend>

  delete(id: string): Promise<void>
}
