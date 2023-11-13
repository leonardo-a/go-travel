import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'
import { CreateListUseCase } from '../domains/lists/create-list'
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaFriendsRepositoty } from '@/repositories/prisma/prisma-friends-repository'

export function makeCreateListUseCase() {
  const listsRepository = new PrismaListsRepository()
  const membersRepository = new PrismaMembersRepository()
  const usersRepository = new PrismaUsersRepository()
  const friendsRepository = new PrismaFriendsRepositoty()

  const useCase = new CreateListUseCase(
    listsRepository,
    membersRepository,
    usersRepository,
    friendsRepository,
  )

  return useCase
}
