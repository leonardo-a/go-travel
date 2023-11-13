import { Friend, Prisma } from '@prisma/client'
import {
  FriendsFetchManyParams,
  FriendsRepository,
} from '../friends-repository'
import { prisma } from '@/libs/prisma'

export class PrismaFriendsRepositoty implements FriendsRepository {
  async create(data: Prisma.FriendUncheckedCreateInput) {
    const friend = await prisma.friend.create({
      data,
    })

    return friend
  }

  async findById(id: string) {
    const friend = await prisma.friend.findUnique({
      where: {
        id,
      },
    })

    return friend
  }

  async findUnique(userId: string, friendId: string) {
    const friend = await prisma.friend.findUnique({
      where: {
        user_id_friend_id: {
          user_id: userId,
          friend_id: friendId,
        },
      },
    })

    return friend
  }

  async fetchMany({ userId, query, page, accepted }: FriendsFetchManyParams) {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            user_id: userId,
          },
          {
            friend_id: userId,
          },
        ],
        user: {
          name: {
            contains: query,
          },
        },
        accepted_at: accepted
          ? {
              not: null,
            }
          : null,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return friends
  }

  async fetchByIds(userId: string, friendsIds: string[]) {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          {
            user_id: userId,
            friend_id: {
              in: friendsIds,
            },
          },
          {
            friend_id: userId,
            user_id: {
              in: friendsIds,
            },
          },
        ],
      },
    })

    return friends
  }

  async save(data: Friend) {
    const friend = await prisma.friend.update({
      where: {
        id: data.id,
      },
      data,
    })

    return friend
  }

  async delete(id: string) {
    await prisma.friend.delete({
      where: {
        id,
      },
    })
  }
}
