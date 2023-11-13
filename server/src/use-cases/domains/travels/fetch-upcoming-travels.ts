import { TravelsRepository } from '@/repositories/travels-repository'
import { Travel } from '@prisma/client'

interface FetchUpcomingTravelsUseCaseRequest {
  userId: string
}

interface FetchUpcomingTravelsUseCaseResponse {
  travels: Travel[]
}

export class FetchUpcomingTravelsUseCase {
  constructor(private travelsRepository: TravelsRepository) {}

  async execute({
    userId,
  }: FetchUpcomingTravelsUseCaseRequest): Promise<FetchUpcomingTravelsUseCaseResponse> {
    const travels = await this.travelsRepository.fetchMany(userId, '', 1, true)

    return {
      travels,
    }
  }
}
