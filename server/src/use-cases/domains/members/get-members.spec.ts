import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { GetMembersUseCase } from './get-members'
import { describe, beforeEach, it, expect } from 'vitest'
import { createTestUsers } from '@/utils/create-test-users'
import { createTestLists } from '@/utils/create-test-lists'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'

let membersRepository: InMemoryMembersRepository
let usersRepository: InMemoryUsersRepository
let listsRepository: InMemoryListsRepository
let sut: GetMembersUseCase

describe('Get Members Use Case', () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    usersRepository = new InMemoryUsersRepository()
    listsRepository = new InMemoryListsRepository()
    sut = new GetMembersUseCase(
      membersRepository,
      usersRepository,
      listsRepository,
    )
  })

  it('should be able to get the members from a list', async () => {
    const [list] = createTestLists(1).map((list) => {
      listsRepository.items.push(list)

      return list
    })

    createTestUsers(4).forEach((user, index) => {
      usersRepository.items.push(user)

      membersRepository.items.push({
        id: `member-${index}`,
        list_id: list.id,
        user_id: user.id,
        accepted_at: new Date(),
      })
    })

    const { members } = await sut.execute({ listId: list.id })

    expect(members).toHaveLength(4)
  })
  it('should not be able to get the members from a non-existent list', async () => {
    await expect(() =>
      sut.execute({ listId: 'invalid-list' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to get the members that didnt accept the invitation', async () => {
    const [list] = createTestLists(1).map((list) => {
      listsRepository.items.push(list)

      return list
    })

    createTestUsers(4).forEach((user, index) => {
      usersRepository.items.push(user)

      let acceptedAt: Date | null = new Date()

      if (index > 1) {
        acceptedAt = null
      }

      membersRepository.items.push({
        id: `member-${index}`,
        list_id: list.id,
        user_id: user.id,
        accepted_at: acceptedAt,
      })
    })

    const { members } = await sut.execute({ listId: list.id })

    expect(members).toHaveLength(2)
  })
  // it('should not be able to get the members from a list that the user isnt part of', async() => {})
})
