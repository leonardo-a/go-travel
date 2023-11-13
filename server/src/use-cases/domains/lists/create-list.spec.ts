import { it, beforeEach, describe, expect } from 'vitest'
import { CreateListUseCase } from './create-list'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { createTestUsers } from '@/utils/create-test-users'
import { UserNotFoundError } from '@/use-cases/errors/user-not-found-error'
import { InMemoryFriendsRepository } from '@/repositories/in-memory/in-memory-friends-repository'
import { MustBeFriendsError } from '@/use-cases/errors/must-be-friends-error'

let listsRepository: InMemoryListsRepository
let membersRepository: InMemoryMembersRepository
let usersRepository: InMemoryUsersRepository
let friendsRepository: InMemoryFriendsRepository
let sut: CreateListUseCase

describe('Create List Use Case', () => {
  beforeEach(() => {
    listsRepository = new InMemoryListsRepository()
    membersRepository = new InMemoryMembersRepository()
    usersRepository = new InMemoryUsersRepository()
    friendsRepository = new InMemoryFriendsRepository()
    sut = new CreateListUseCase(
      listsRepository,
      membersRepository,
      usersRepository,
      friendsRepository,
    )
  })

  it('should be create a list', async () => {
    let owner = ''

    createTestUsers(1).forEach((user) => {
      usersRepository.items.push(user)

      owner = user.id
    })

    const { list } = await sut.execute({
      name: 'Test List',
      userId: owner,
    })

    expect(list.id).toEqual(expect.any(String))
    expect(membersRepository.items).toHaveLength(1)
    expect(membersRepository.items[0].user_id).toEqual(owner)
  })

  it('should be able to create a list with users', async () => {
    let owner = ''

    createTestUsers(1).forEach((user) => {
      usersRepository.items.push(user)

      owner = user.id
    })

    const members = createTestUsers(3).map((user, index) => {
      usersRepository.items.push(user)
      friendsRepository.items.push({
        id: `friend-${index + 1}`,
        user_id: owner,
        friend_id: user.id,
        requested_at: new Date(),
        accepted_at: new Date(),
      })

      return user.id
    })

    const { list } = await sut.execute({
      name: 'Test List',
      userId: owner,
      members,
    })

    expect(list.id).toEqual(expect.any(String))
    // Deve ser 4 pois o dono da lista deve ser levado em consideração com os outros
    expect(membersRepository.items.length).toEqual(4)
  })

  it('should not be able to create a lists with invalid users', async () => {
    let owner = ''

    createTestUsers(1).forEach((user) => {
      usersRepository.items.push(user)

      owner = user.id
    })

    await expect(() =>
      sut.execute({
        name: 'Test List',
        userId: owner,
        members: ['user-1', 'user-2', 'user-3'],
      }),
    ).rejects.toBeInstanceOf(MustBeFriendsError)
  })

  it('should not be able to create a list with non-existent owner', async () => {
    await expect(() =>
      sut.execute({
        name: 'Test List',
        userId: 'invalid-owner',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
