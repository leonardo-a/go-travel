import { Travel } from '@prisma/client'
import { TravelsRepository } from '@/repositories/travels-repository'
import { ListsRepository } from '@/repositories/lists-repository'
import { MembersRepository } from '@/repositories/members-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'

interface GetTravelUseCaseRequest {
  travelId: string
}

interface GetTravelUseCaseResponse {
  travel: Travel
  list: {
    id: string
    name: string
    members: string[]
  }
}

export class GetTravelUseCase {
  constructor(
    private travelsRepository: TravelsRepository,
    private listsRepository: ListsRepository,
    private membersRepository: MembersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    travelId,
  }: GetTravelUseCaseRequest): Promise<GetTravelUseCaseResponse> {
    const travel = await this.travelsRepository.findById(travelId)

    if (!travel) {
      throw new ResourceNotFoundError()
    }

    const list = await this.listsRepository.findById(travel.list_id)

    if (!list) {
      throw new ResourceNotFoundError()
    }

    const members = await this.membersRepository.fetchByList(list.id, true)

    const usersIds = members.map((member) => {
      return member.user_id
    })

    const users = await this.usersRepository.fetchByIds(usersIds)

    const usersNames = users.map((user) => {
      return user.name
    })

    return {
      travel: {
        ...travel,
        costs: travel.costs ? travel.costs / 100 : null,
      },
      list: {
        id: list.id,
        name: list.name,
        members: usersNames,
      },
    }
  }
}
