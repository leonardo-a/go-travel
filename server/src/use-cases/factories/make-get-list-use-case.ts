import { GetListUseCase } from '../domains/lists/get-list'

import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'

export function makeGetListUseCase() {
  const listsRepository = new PrismaListsRepository()
  const membersRepository = new PrismaMembersRepository()

  const useCase = new GetListUseCase(listsRepository, membersRepository)

  return useCase
}
