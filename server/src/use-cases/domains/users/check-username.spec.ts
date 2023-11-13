import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckUsernameUseCase } from './check-username'
import { createTestUsers } from '@/utils/create-test-users'

let usersRepository: InMemoryUsersRepository
let sut: CheckUsernameUseCase

describe('Check Username Availability Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CheckUsernameUseCase(usersRepository)
  })

  it('should be able to check an username is available', async () => {
    const { isAvailable } = await sut.excute({
      username: 'available-username',
    })

    expect(isAvailable).toBeTruthy()
  })

  it('should be able to check an username is not available', async () => {
    const [user] = createTestUsers(1)

    usersRepository.items.push(user)

    const { isAvailable } = await sut.excute({
      username: user.username,
    })

    expect(isAvailable).toBeFalsy()
  })
})
