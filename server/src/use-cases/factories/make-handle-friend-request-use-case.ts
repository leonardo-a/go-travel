import { PrismaFriendsRepositoty } from '@/repositories/prisma/prisma-friends-repository'
import { HandleFriendRequestUseCase } from '../domains/friends/handle-friend-request'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeHandleFriendRequestUseCase() {
  const friendsRepository = new PrismaFriendsRepositoty()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new HandleFriendRequestUseCase(
    friendsRepository,
    usersRepository,
  )

  return useCase
}
