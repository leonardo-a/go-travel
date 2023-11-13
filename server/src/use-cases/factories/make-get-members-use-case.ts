import { GetMembersUseCase } from '../domains/members/get-members'

import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'

export function makeGetMembersUseCase() {
  const membersRepository = new PrismaMembersRepository()
  const usersRepository = new PrismaUsersRepository()
  const listsRepository = new PrismaListsRepository()

  const useCase = new GetMembersUseCase(
    membersRepository,
    usersRepository,
    listsRepository,
  )

  return useCase
}
