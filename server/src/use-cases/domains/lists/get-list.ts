import { ListsRepository } from '@/repositories/lists-repository'
import { MembersRepository } from '@/repositories/members-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { List } from '@prisma/client'

interface GetListUseCaseRequest {
  userId: string
  listId: string
}

interface GetListUseCaseResponse {
  list: List
}

export class GetListUseCase {
  constructor(
    private listsRepository: ListsRepository,
    private membersRepository: MembersRepository,
  ) {}

  async execute({
    listId,
    userId,
  }: GetListUseCaseRequest): Promise<GetListUseCaseResponse> {
    const list = await this.listsRepository.findById(listId)

    if (!list) {
      throw new ResourceNotFoundError()
    }

    const members = await this.membersRepository.fetchByList(listId, true)

    const membersIds = members.map((member) => {
      return member.user_id
    })

    if (!membersIds.includes(userId)) {
      throw new UnauthorizedError()
    }

    return {
      list,
    }
  }
}
