import { ListsRepository } from '@/repositories/lists-repository'
import { TravelsRepository } from '@/repositories/travels-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { Travel } from '@prisma/client'

interface FetchTravelsUseCaseRequest {
  listId: string
}

interface FetchTravelsUseCaseResponse {
  travels: Travel[]
}

export class FetchTravelsUseCase {
  constructor(
    private travelsRepository: TravelsRepository,
    private listsRepository: ListsRepository,
  ) {}

  async execute({
    listId,
  }: FetchTravelsUseCaseRequest): Promise<FetchTravelsUseCaseResponse> {
    const list = await this.listsRepository.findById(listId)

    if (!list) {
      throw new ResourceNotFoundError()
    }

    const travels = await this.travelsRepository.fetchByList(listId)

    return {
      travels,
    }
  }
}
