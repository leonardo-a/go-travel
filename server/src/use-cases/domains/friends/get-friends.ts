import { FriendsRepository } from '@/repositories/friends-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidValuesError } from '@/use-cases/errors/invalid-values-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { User } from '@prisma/client'

interface GetFriendsUseCaseRequest {
  userId: string
  query: string
  page: number
  received?: boolean
  accepted?: boolean
}

interface GetFriendsUseCaseResponse {
  friends: {
    id: string
    friendId: string
    username: string
    name: string
    requestedByMe: boolean
    acceptedAt: Date | null
  }[]
}

export class GetFriendsUseCase {
  constructor(
    private friendsRepository: FriendsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    page,
    received,
    accepted,
    query,
  }: GetFriendsUseCaseRequest): Promise<GetFriendsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const friends = await this.friendsRepository.fetchMany({
      userId,
      query,
      page,
      received,
      accepted: accepted ?? true,
    })

    const friendsUserIds = friends.map((friend) => {
      return userId === friend.user_id ? friend.friend_id : friend.user_id
    })

    const users = await this.usersRepository.fetchByIds(friendsUserIds)

    if (users.length !== friends.length) {
      throw new InvalidValuesError()
    }

    return {
      friends: friends.map((friend) => {
        const friendUser = users.find(
          (data) =>
            data.id ===
            (userId === friend.user_id ? friend.friend_id : friend.user_id),
        ) as User

        return {
          id: friend.id,
          friendId:
            userId === friend.user_id ? friend.friend_id : friend.user_id,
          username: friendUser.username,
          name: friendUser.name,
          requestedByMe: userId === friend.user_id,
          acceptedAt: friend.accepted_at,
        }
      }),
    }
  }
}
