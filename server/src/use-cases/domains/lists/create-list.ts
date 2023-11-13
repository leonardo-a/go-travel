import { ListsRepository } from '@/repositories/lists-repository'
import { MembersRepository } from '@/repositories/members-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { List } from '@prisma/client'
import { UserNotFoundError } from '../../errors/user-not-found-error'
import { FriendsRepository } from '@/repositories/friends-repository'
import { MustBeFriendsError } from '@/use-cases/errors/must-be-friends-error'

interface CreateListUseCaseRequest {
  name: string
  userId: string
  members?: string[]
  cover?: string
}

interface CreateListUseCaseResponse {
  list: List
}

export class CreateListUseCase {
  constructor(
    private listsRepository: ListsRepository,
    private membersRepository: MembersRepository,
    private usersRepository: UsersRepository,
    private friendsRepository: FriendsRepository,
  ) {}

  async execute({
    name,
    userId,
    members,
    cover,
  }: CreateListUseCaseRequest): Promise<CreateListUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const list = await this.listsRepository.create({
      name,
      owner_id: userId,
      cover_photo: cover,
    })

    if (members) {
      const findMembers = await this.friendsRepository.fetchByIds(
        userId,
        members,
      )

      if (members.length !== findMembers.length) {
        throw new MustBeFriendsError()
      }
    }

    // Adiciona o dono da lista/usuário que criou como membro
    await this.membersRepository.create({
      list_id: list.id,
      user_id: userId,
      accepted_at: new Date(),
    })

    if (members) {
      await this.membersRepository.createMany(list.id, members, true)
    }

    return {
      list,
    }
  }
}
