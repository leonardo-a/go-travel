import { PrismaFriendsRepositoty } from '@/repositories/prisma/prisma-friends-repository'
import { GetFriendsUseCase } from '../domains/friends/get-friends'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetFriendsUseCase() {
  const friendsRepository = new PrismaFriendsRepositoty()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetFriendsUseCase(friendsRepository, usersRepository)

  return useCase
}
