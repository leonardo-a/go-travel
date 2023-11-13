import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { RegisterMembersUseCase } from './register-members'
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { createTestUsers } from '@/utils/create-test-users'
import { InvalidValuesError } from '@/use-cases/errors/invalid-values-error'

let membersRepository: InMemoryMembersRepository
let listsRepository: InMemoryListsRepository
let usersRepository: InMemoryUsersRepository
let sut: RegisterMembersUseCase

describe('Register Members Use Case', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    listsRepository = new InMemoryListsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterMembersUseCase(
      membersRepository,
      listsRepository,
      usersRepository,
    )
  })

  it('should be able to register a member to a list', async () => {
    const users = createTestUsers(3).map((user) => {
      usersRepository.items.push(user)

      return user.id
    })

    listsRepository.items.push({
      id: 'list-1',
      name: 'Test List',
      owner_id: 'user-1',
      cover_photo: null,
      created_at: new Date(),
    })

    const { done } = await sut.execute({
      listId: 'list-1',
      owner: 'user-1',
      users,
    })

    expect(done).toEqual(users.length)
  })

  it('should not be able to register members to a non-existent list', async () => {
    const users = createTestUsers(3).map((user) => {
      usersRepository.items.push(user)

      return user.id
    })

    await expect(() =>
      sut.execute({
        listId: 'list-1',
        owner: 'user-1',
        users,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register non-existent members to a list', async () => {
    listsRepository.items.push({
      id: 'list-1',
      name: 'Test List',
      owner_id: 'user-1',
      cover_photo: null,
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        listId: 'list-1',
        owner: 'user-1',
        users: ['inavlid-user-1', 'inavlid-user-2', 'inavlid-user-3'],
      }),
    ).rejects.toBeInstanceOf(InvalidValuesError)
  })

  it('should not be able to register members if user is not the owner of the list', async () => {
    const users = createTestUsers(3).map((user) => {
      usersRepository.items.push(user)

      return user.id
    })

    listsRepository.items.push({
      id: 'list-1',
      name: 'Test List',
      owner_id: 'user-1',
      cover_photo: null,
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        listId: 'list-1',
        owner: 'user-2',
        users,
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
