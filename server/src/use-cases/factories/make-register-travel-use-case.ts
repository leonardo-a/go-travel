import { PrismaTravelsRepository } from '@/repositories/prisma/prisma-travels-repository'
import { RegisterTravelUseCase } from '../domains/travels/register-travel'
import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'

export function makeRegisterTravelUseCase() {
  const travelsRepository = new PrismaTravelsRepository()
  const listsRepository = new PrismaListsRepository()

  const useCase = new RegisterTravelUseCase(travelsRepository, listsRepository)

  return useCase
}
