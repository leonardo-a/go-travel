import { ListsRepository } from '@/repositories/lists-repository'
import { MembersRepository } from '@/repositories/members-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidValuesError } from '@/use-cases/errors/invalid-values-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'

interface RegisterMembersUseCaseRequest {
  owner: string
  listId: string
  users: string[]
}

interface RegisterMembersUseCaseResponse {
  done: number
}

export class RegisterMembersUseCase {
  constructor(
    private membersRepository: MembersRepository,
    private listsRepository: ListsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    owner,
    listId,
    users,
  }: RegisterMembersUseCaseRequest): Promise<RegisterMembersUseCaseResponse> {
    const list = await this.listsRepository.findById(listId)

    if (!list) {
      throw new ResourceNotFoundError()
    }

    if (list.owner_id !== owner) {
      throw new UnauthorizedError()
    }

    const findUsers = await this.usersRepository.fetchByIds(users)

    if (findUsers.length !== users.length) {
      throw new InvalidValuesError()
    }

    const membersCreatedCount = await this.membersRepository.createMany(
      listId,
      users,
    )

    return {
      done: membersCreatedCount,
    }
  }
}
