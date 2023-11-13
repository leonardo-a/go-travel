import { InMemoryFriendsRepository } from '@/repositories/in-memory/in-memory-friends-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { HandleFriendRequestUseCase } from './handle-friend-request'
import { createTestUsers } from '@/utils/create-test-users'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'

let friendsRepository: InMemoryFriendsRepository
let usersRepository: InMemoryUsersRepository
let sut: HandleFriendRequestUseCase

describe('Hanle Friend Request Use Case', async () => {
  beforeEach(() => {
    friendsRepository = new InMemoryFriendsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new HandleFriendRequestUseCase(friendsRepository, usersRepository)
  })

  it('should be able to accept a friend request', async () => {
    const [user, friendUser] = createTestUsers(2).map((testUser) => {
      usersRepository.items.push(testUser)

      return testUser
    })

    friendsRepository.items.push({
      id: 'friends-1',
      user_id: user.id,
      friend_id: friendUser.id,
      accepted_at: null,
      requested_at: new Date(),
    })

    const { friend } = await sut.execute({
      userId: friendUser.id,
      friendRequestId: 'friends-1',
      accepted: true,
    })

    expect(friend.accepted_at).toBeInstanceOf(Date)
  })

  it('should be able to deny a friend request', async () => {
    const [user, friendUser] = createTestUsers(2).map((testUser) => {
      usersRepository.items.push(testUser)

      return testUser
    })

    friendsRepository.items.push({
      id: 'friends-1',
      user_id: user.id,
      friend_id: friendUser.id,
      accepted_at: null,
      requested_at: new Date(),
    })

    const { friend } = await sut.execute({
      userId: friendUser.id,
      friendRequestId: 'friends-1',
      accepted: false,
    })

    expect(friendsRepository.items).toHaveLength(0)
  })

  it('should not be able to accept non-existent friend request', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-1',
        friendRequestId: 'friends-1',
        accepted: true,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to let only the user that receive the request accept it', async () => {
    const [user, friendUser] = createTestUsers(2).map((testUser) => {
      usersRepository.items.push(testUser)

      return testUser
    })

    friendsRepository.items.push({
      id: 'friends-1',
      user_id: user.id,
      friend_id: friendUser.id,
      accepted_at: null,
      requested_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
        friendRequestId: 'friends-1',
        accepted: true,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should not be able to a non-existent user accept a request', async () => {
    friendsRepository.items.push({
      id: 'friends-1',
      user_id: 'user-1',
      friend_id: 'user-1',
      accepted_at: null,
      requested_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        userId: 'invalid-user',
        friendRequestId: 'friends-1',
        accepted: true,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
