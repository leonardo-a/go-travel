import { it, beforeEach, describe, expect } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialError } from '@/use-cases/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate an user', async () => {
    const email = 'johndoe@test.com'
    const password = '12345678Pw'

    const passwordHash = await hash(password, 6)

    usersRepository.items.push({
      id: 'random-id',
      name: 'John Doe',
      username: 'jonhdoe',
      email,
      password_hash: passwordHash,
      role: 'USER',
      status: null,
    })

    const { user } = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const email = 'johndoe@test.com'
    const password = '12345678Pw'

    const passwordHash = await hash(password, 6)

    usersRepository.items.push({
      id: 'random-id',
      name: 'John Doe',
      username: 'johndoe',
      email,
      password_hash: passwordHash,
      role: 'USER',
      status: null,
    })

    await expect(() =>
      sut.execute({
        email: 'johnnydoe@test.com',
        password: '12345678Pw',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'johndoe@test.com'
    const password = '12345678Pw'

    const passwordHash = await hash(password, 6)

    usersRepository.items.push({
      id: 'random-id',
      name: 'John Doe',
      username: 'johndoe',
      email,
      password_hash: passwordHash,
      role: 'USER',
      status: null,
    })

    await expect(() =>
      sut.execute({
        email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialError)
  })
})
