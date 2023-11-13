import { PrismaTravelsRepository } from '@/repositories/prisma/prisma-travels-repository'
import { GetTravelUseCase } from '../domains/travels/get-travel'
import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'
import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetTravelUseCase() {
  const travelsRepository = new PrismaTravelsRepository()
  const listsRepository = new PrismaListsRepository()
  const membersRepository = new PrismaMembersRepository()
  const usersRepository = new PrismaUsersRepository()

  const useCase = new GetTravelUseCase(
    travelsRepository,
    listsRepository,
    membersRepository,
    usersRepository,
  )

  return useCase
}
