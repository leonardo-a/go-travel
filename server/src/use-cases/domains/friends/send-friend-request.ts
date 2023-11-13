import { FriendsRepository } from '@/repositories/friends-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { DuplicatedResourceError } from '@/use-cases/errors/duplicated-resource-error'
import { InvalidValuesError } from '@/use-cases/errors/invalid-values-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { Friend } from '@prisma/client'

interface SendFriendRequestUseCaseRequest {
  userId: string
  username: string
}

interface SendFriendRequestUseCaseResponse {
  friend: Friend
}

export class SendFriendRequestUseCase {
  constructor(
    private friendsRepository: FriendsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    username,
  }: SendFriendRequestUseCaseRequest): Promise<SendFriendRequestUseCaseResponse> {
    const friendUser = await this.usersRepository.findByUsername(username)

    if (!friendUser) {
      throw new UserNotFoundError()
    }

    if (userId === friendUser.id) {
      throw new InvalidValuesError()
    }

    const isFriend = await this.friendsRepository.findUnique(
      userId,
      friendUser.id,
    )

    if (isFriend) {
      throw new DuplicatedResourceError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const friend = await this.friendsRepository.create({
      user_id: userId,
      friend_id: friendUser.id,
    })

    return {
      friend,
    }
  }
}
