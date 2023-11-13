import { ListsRepository } from '@/repositories/lists-repository'
import { TravelsRepository } from '@/repositories/travels-repository'
import { Travel } from '@prisma/client'
import { ResourceNotFoundError } from '../../errors/resource-not-found-error'
import { UnauthorizedError } from '../../errors/unauthorized-error'

interface RegisterTravelUseCaseRequest {
  listId: string
  userId: string
  destination: string
  country: string
  startAt: Date
  transportId?: number
  costs?: number
  cover?: string
  duration?: number
}

interface RegisterTravelUseCaseResponse {
  travel: Travel
}

export class RegisterTravelUseCase {
  constructor(
    private travelsRepository: TravelsRepository,
    private listsRepository: ListsRepository,
  ) {}

  async execute({
    listId,
    userId,
    destination,
    country,
    startAt,
    costs,
    cover,
    duration,
    transportId,
  }: RegisterTravelUseCaseRequest): Promise<RegisterTravelUseCaseResponse> {
    const list = await this.listsRepository.findById(listId)

    if (!list) {
      throw new ResourceNotFoundError()
    }

    if (list.owner_id !== userId) {
      throw new UnauthorizedError()
    }

    const travel = await this.travelsRepository.create({
      destination,
      list_id: listId,
      country,
      start_date: startAt,
      costs,
      cover_photo: cover,
      transportation_id: transportId,
      duration,
    })

    return {
      travel,
    }
  }
}
