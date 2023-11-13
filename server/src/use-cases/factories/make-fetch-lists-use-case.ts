import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'
import { FetchListsUseCase } from '../domains/lists/fetch-lists'
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeFetchListsUseCase() {
  const listsRepository = new PrismaListsRepository()
  const membersRepository = new PrismaMembersRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new FetchListsUseCase(
    listsRepository,
    membersRepository,
    usersRepository,
  )

  return useCase
}
