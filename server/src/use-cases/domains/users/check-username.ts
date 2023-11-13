import { UsersRepository } from '@/repositories/users-repository'

interface CheckUsernameUseCaseRequest {
  username: string
}

interface CheckUsernameUseCaseResponse {
  isAvailable: boolean
}

export class CheckUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async excute({
    username,
  }: CheckUsernameUseCaseRequest): Promise<CheckUsernameUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username)

    return {
      isAvailable: !user,
    }
  }
}
