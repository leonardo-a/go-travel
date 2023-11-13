import { hash } from 'bcryptjs'
import { User } from '@prisma/client'

import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { UsernameInUseError } from '@/use-cases/errors/username-in-use-error'

interface RegisterUseCaseRequest {
  username: string
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'USER'
  status?: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
    name,
    email,
    password,
    role,
    status,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithEmail = await this.usersRepository.findByEmail(email)

    if (userWithEmail) {
      throw new UserAlreadyExistsError()
    }

    const userWithUsername = await this.usersRepository.findByUsername(username)

    if (userWithUsername) {
      throw new UsernameInUseError()
    }

    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      username,
      name,
      email,
      password_hash: passwordHash,
      role,
      status,
    })

    return {
      user,
    }
  }
}
