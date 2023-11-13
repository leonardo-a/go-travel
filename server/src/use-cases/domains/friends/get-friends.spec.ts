import { InMemoryFriendsRepository } from '@/repositories/in-memory/in-memory-friends-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetFriendsUseCase } from './get-friends'
import { createTestUsers } from '@/utils/create-test-users'

let friendsRepository: InMemoryFriendsRepository
let usersRepository: InMemoryUsersRepository
let sut: GetFriendsUseCase

describe('Get Friends Use Case', () => {
  beforeEach(() => {
    friendsRepository = new InMemoryFriendsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetFriendsUseCase(friendsRepository, usersRepository)
  })

  it('should be able to get users friends', async () => {
    const [user, ...friendUsers] = createTestUsers(4).map((user) => {
      usersRepository.items.push(user)

      return user
    })

    friendUsers.forEach((friend, index) => {
      friendsRepository.items.push({
        id: `friend-${index}`,
        user_id: user.id,
        friend_id: friend.id,
        requested_at: new Date(),
        accepted_at: new Date(),
      })
    })

    const { friends } = await sut.execute({
      userId: user.id,
      query: '',
      page: 1,
    })

    expect(friends.length).toEqual(3)
    expect(friends[0].id).toEqual(expect.any(String))
  })

  it('should not be able to get users friends if they didnt accept the request', async () => {
    const [user, ...friendUsers] = createTestUsers(4).map((user) => {
      usersRepository.items.push(user)

      return user
    })

    friendUsers.forEach((friend, index) => {
      friendsRepository.items.push({
        id: `friend-${index}`,
        user_id: user.id,
        friend_id: friend.id,
        requested_at: new Date(),
        accepted_at: null,
      })
    })

    const { friends } = await sut.execute({
      userId: user.id,
      query: '',
      page: 1,
    })

    expect(friends.length).toEqual(0)
  })
})
