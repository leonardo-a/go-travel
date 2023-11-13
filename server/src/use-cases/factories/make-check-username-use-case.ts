import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CheckUsernameUseCase } from '../domains/users/check-username'

export function makeCheckUsernameUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new CheckUsernameUseCase(usersRepository)

  return useCase
}
