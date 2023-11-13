import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

interface GetProfileUseCaseRequest {
  id: string
}

interface GetProfileUseCaseResponse {
  user: User
}

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      user,
    }
  }
}
