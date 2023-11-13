import { FetchTravelsUseCase } from '../domains/travels/fetch-travels'
import { PrismaTravelsRepository } from '@/repositories/prisma/prisma-travels-repository'
import { PrismaListsRepository } from '@/repositories/prisma/prisma-lists-repository'

export function makeFetchTravelsUseCase() {
  const travelsRepository = new PrismaTravelsRepository()
  const listsRepository = new PrismaListsRepository()

  const useCase = new FetchTravelsUseCase(travelsRepository, listsRepository)

  return useCase
}
