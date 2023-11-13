import { RegisterMembersUseCase } from '../domains/members/register-members'

import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'
import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeRegisterMembersUseCase() {
  const membersRepository = new PrismaMembersRepository()
  const listsRepository = new PrismaListsRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new RegisterMembersUseCase(
    membersRepository,
    listsRepository,
    usersRepository,
  )

  return useCase
}
