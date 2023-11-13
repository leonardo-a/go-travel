import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUsersUseCase } from './fetch-users'
import { createTestUsers } from '@/utils/create-test-users'

let usersRepository: InMemoryUsersRepository
let sut: FetchUsersUseCase

describe('Fetch Users Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersUseCase(usersRepository)
  })

  it('should be able to search for users', async () => {
    createTestUsers(3).forEach((user, index) => {
      if (index === 0) {
        user.name = 'John Doe'
        user.username = 'john_doe'
      } else if (index === 1) {
        user.name = 'Hugh Wood'
        user.username = 'iamwood'
      } else if (index === 2) {
        user.name = 'Lili Wood'
        user.username = 'lili_doe'
      }

      usersRepository.items.push(user)
    })

    const { users: usersWithDoe } = await sut.execute({
      query: 'doe',
      page: 1,
      userId: 'user-1',
    })

    const { users: usersWithWood } = await sut.execute({
      query: 'wood',
      page: 1,
      userId: 'user-1',
    })

    expect(usersWithDoe).toHaveLength(2)
    expect(usersWithWood).toHaveLength(2)
  })
})
