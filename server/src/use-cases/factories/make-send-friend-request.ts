import { PrismaFriendsRepositoty } from '@/repositories/prisma/prisma-friends-repository'
import { SendFriendRequestUseCase } from '../domains/friends/send-friend-request'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeSendFriendRequestUseCase() {
  const friendsRepository = new PrismaFriendsRepositoty()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new SendFriendRequestUseCase(
    friendsRepository,
    usersRepository,
  )

  return useCase
}
