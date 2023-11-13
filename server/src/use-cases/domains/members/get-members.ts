import { ListsRepository } from '@/repositories/lists-repository'
import { MembersRepository } from '@/repositories/members-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { User } from '@prisma/client'

interface GetMembersUseCaseRequest {
  listId: string
  accepted?: boolean
}

interface GetMembersUseCaseResponse {
  members: {
    id: string
    name: string
    status?: string
  }[]
}

export class GetMembersUseCase {
  constructor(
    private membersRepository: MembersRepository,
    private usersRepository: UsersRepository,
    private listsRepository: ListsRepository,
  ) {}

  async execute({
    listId,
    accepted = true,
  }: GetMembersUseCaseRequest): Promise<GetMembersUseCaseResponse> {
    const list = await this.listsRepository.findById(listId)

    if (!list) {
      throw new ResourceNotFoundError()
    }

    const members = await this.membersRepository.fetchByList(listId, accepted)

    const usersIds = members.map((member) => {
      return member.user_id
    })

    const users = await this.usersRepository.fetchByIds(usersIds)

    return {
      members: members.map((member) => {
        const user = users.find((user) => user.id === member.user_id) as User

        return {
          id: member.id,
          name: user.name,
          status: user.status || undefined,
        }
      }),
    }
  }
}
