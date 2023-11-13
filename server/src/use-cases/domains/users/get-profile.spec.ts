import { it, beforeEach, describe, expect } from 'vitest'
import { GetProfileUseCase } from './get-profile'
import { createTestUsers } from '@/utils/create-test-users'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

let usersRepository: InMemoryUsersRepository
let sut: GetProfileUseCase

describe('Get Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUseCase(usersRepository)
  })

  it('should be able to get user details', async () => {
    let userId = ''

    createTestUsers(1).forEach((user) => {
      usersRepository.items.push(user)
      userId = user.id
    })

    const { user } = await sut.execute({
      id: userId,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to get non-existent user details', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid-user',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
