import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'

interface FetchUsersUseCaseRequest {
  query: string
  page: number
  userId: string
}

interface FetchUsersUseCaseResponse {
  users: User[]
}
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    query,
    page,
    userId,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const users = await this.usersRepository.fetchMany(query, page, userId)

    return {
      users,
    }
  }
}
