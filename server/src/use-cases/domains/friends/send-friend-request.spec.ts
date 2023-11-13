import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryFriendsRepository } from '@/repositories/in-memory/in-memory-friends-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { SendFriendRequestUseCase } from './send-friend-request'
import { createTestUsers } from '@/utils/create-test-users'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InvalidValuesError } from '@/use-cases/errors/invalid-values-error'

let friendsRepository: InMemoryFriendsRepository
let usersRepository: InMemoryUsersRepository
let sut: SendFriendRequestUseCase

describe('Send Friend Request Use Case', () => {
  beforeEach(() => {
    friendsRepository = new InMemoryFriendsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new SendFriendRequestUseCase(friendsRepository, usersRepository)
  })

  it('should be able to send a friend request', async () => {
    const users = createTestUsers(2).map((user) => {
      usersRepository.items.push(user)

      return user
    })

    const { friend } = await sut.execute({
      userId: users[0].id,
      username: users[1].username,
    })

    expect(friend.id).toEqual(expect.any(String))
  })

  it('should not be able to send a friend request to non-existent user', async () => {
    const users = createTestUsers(1).map((user) => {
      usersRepository.items.push(user)

      return user.id
    })

    await expect(() =>
      sut.execute({
        userId: users[0],
        username: 'invalid-user',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to a non-existent user send a friend request', async () => {
    const users = createTestUsers(1).map((user) => {
      usersRepository.items.push(user)

      return user.username
    })

    await expect(() =>
      sut.execute({
        userId: 'invalid-user',
        username: users[0],
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to user send a friend request to itself', async () => {
    const users = createTestUsers(1).map((user) => {
      usersRepository.items.push(user)

      return user
    })

    await expect(() =>
      sut.execute({
        userId: users[0].id,
        username: users[0].username,
      }),
    ).rejects.toBeInstanceOf(InvalidValuesError)
  })
})
