import { randomUUID } from 'node:crypto'
import { Friend, Prisma } from '@prisma/client'
import {
  FriendsFetchManyParams,
  FriendsRepository,
} from '../friends-repository'

export class InMemoryFriendsRepository implements FriendsRepository {
  public items: Friend[] = []

  async create(data: Prisma.FriendUncheckedCreateInput) {
    const friend: Friend = {
      id: randomUUID(),
      user_id: data.user_id,
      friend_id: data.friend_id,
      requested_at: new Date(),
      accepted_at: null,
    }

    this.items.push(friend)

    return friend
  }

  async findById(id: string) {
    const friend = this.items.find((item) => item.id === id)

    if (!friend) {
      return null
    }

    return friend
  }

  async findUnique(userId: string, friendId: string): Promise<Friend | null> {
    const friend = this.items.find(
      (item) => item.user_id === userId && item.friend_id === friendId,
    )

    if (!friend) {
      return null
    }

    return friend
  }

  async fetchMany({
    userId,
    page,
    accepted,
  }: FriendsFetchManyParams): Promise<Friend[]> {
    const friends = this.items
      .filter(
        (item) =>
          (item.user_id === userId || item.friend_id === userId) &&
          (accepted ? item.accepted_at !== null : item.accepted_at === null),
      )
      .slice((page - 1) * 20, page * 20)

    return friends
  }

  async fetchByIds(userId: string, friendsIds: string[]): Promise<Friend[]> {
    const friends = this.items.filter(
      (item) =>
        item.user_id === userId &&
        friendsIds.includes(item.friend_id) &&
        item.accepted_at !== null,
    )

    return friends
  }

  async save(friend: Friend) {
    const friendIndex = this.items.findIndex((item) => item.id === friend.id)

    if (friendIndex >= 0) {
      this.items[friendIndex] = friend
    }

    return friend
  }

  async delete(id: string) {
    const friendIndex = this.items.findIndex((item) => item.id === id)

    if (friendIndex < 0) {
      return
    }

    this.items.splice(friendIndex, 1)
  }
}
