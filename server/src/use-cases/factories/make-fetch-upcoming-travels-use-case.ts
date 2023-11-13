import { PrismaTravelsRepository } from '@/repositories/prisma/prisma-travels-repository'
import { FetchUpcomingTravelsUseCase } from '../domains/travels/fetch-upcoming-travels'

export function makeFetchUpcomingTravelsUseCase() {
  const travelsRepository = new PrismaTravelsRepository()

  const useCase = new FetchUpcomingTravelsUseCase(travelsRepository)

  return useCase
}
