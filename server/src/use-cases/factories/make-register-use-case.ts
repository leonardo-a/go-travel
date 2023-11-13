import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../domains/users/register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const useCase = new RegisterUseCase(usersRepository)

  return useCase
}
