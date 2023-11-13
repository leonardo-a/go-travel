import { ListsRepository } from '@/repositories/lists-repository'
import { MembersRepository } from '@/repositories/members-repository'
import { UsersRepository } from '@/repositories/users-repository'

interface FetchListsUseCaseRequest {
  userId: string
  query?: string
  page?: number
  isAccepted?: boolean
}

interface FetchListsUseCaseResponse {
  lists: {
    id: string
    name: string
    coverUrl: string | null
    members: string[]
  }[]
}

export class FetchListsUseCase {
  constructor(
    private listsRepository: ListsRepository,
    private memberRepository: MembersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    query,
    page,
    isAccepted,
  }: FetchListsUseCaseRequest): Promise<FetchListsUseCaseResponse> {
    const lists = await this.listsRepository.fetchMany(
      userId,
      query || '',
      page || 1,
    )

    const listsIds = lists.map((list) => {
      return list.id
    })

    const members = await this.memberRepository.fetchByLists(
      listsIds,
      isAccepted ?? true,
    )

    // Filtra para apenas os usuários que aceitaram o convite para a lista e retorna seus ids
    let usersIds = members.map((member) => {
      return member.user_id
    })

    // Remove ids de usuário duplicados
    usersIds = usersIds.filter(
      (userId, index) => usersIds.indexOf(userId) === index,
    )

    const users = await this.usersRepository.fetchByIds(usersIds)

    const response = lists.map((list) => {
      // Filtra para os usuários que estão na lista de viagens e que aceitaram o convite(usersIds)
      // e retorna uma nova array com seus nomes
      const membersNames = members
        .filter((member) => member.list_id === list.id)
        .map((member) => {
          return users.find((user) => user.id === member.user_id)
            ?.name as string
        })

      return {
        id: list.id,
        name: list.name,
        coverUrl: list.cover_photo,
        members: membersNames,
      }
    })

    return {
      lists: response,
    }
  }
}
