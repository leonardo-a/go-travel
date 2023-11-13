import { FriendsRepository } from '@/repositories/friends-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { Friend } from '@prisma/client'

interface HandleFriendRequestUseCaseRequest {
  userId: string
  friendRequestId: string
  accepted: boolean
}

interface HandleFriendRequestUseCaseResponse {
  friend: Friend
}

export class HandleFriendRequestUseCase {
  constructor(
    private friendsRepository: FriendsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    friendRequestId,
    accepted,
  }: HandleFriendRequestUseCaseRequest): Promise<HandleFriendRequestUseCaseResponse> {
    const friend = await this.friendsRepository.findById(friendRequestId)

    if (!friend) {
      throw new ResourceNotFoundError()
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (userId !== friend.friend_id && accepted === true) {
      throw new UnauthorizedError()
    }

    if (!accepted) {
      await this.friendsRepository.delete(friendRequestId)

      return {
        friend,
      }
    }

    friend.accepted_at = new Date()

    await this.friendsRepository.save(friend)

    return {
      friend,
    }
  }
}
