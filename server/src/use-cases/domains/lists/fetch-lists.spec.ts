import { it, beforeEach, describe, expect } from 'vitest'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { createTestUsers } from '@/utils/create-test-users'
import { FetchListsUseCase } from './fetch-lists'
import { createTestLists } from '@/utils/create-test-lists'

let listsRepository: InMemoryListsRepository
let membersRepository: InMemoryMembersRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchListsUseCase

describe('Get Lists Use Case', () => {
  beforeEach(() => {
    listsRepository = new InMemoryListsRepository()
    membersRepository = new InMemoryMembersRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchListsUseCase(
      listsRepository,
      membersRepository,
      usersRepository,
    )
  })

  it('should be able to get lists summary', async () => {
    const [firstList, secondList] = createTestLists(2).map((list) => {
      listsRepository.items.push(list)

      return list
    })

    createTestUsers(8).forEach((user, index) => {
      usersRepository.items.push(user)

      let listId = firstList.id

      if (index >= 4) {
        listId = secondList.id
      }

      membersRepository.items.push({
        id: `member-${index + 1}`,
        list_id: listId,
        user_id: user.id,
        accepted_at: new Date(),
      })
    })

    const { lists } = await sut.execute({ query: '', page: 1 })

    expect(lists).toHaveLength(2)
    expect(lists[0].members).toHaveLength(4)
    expect(lists[1].members).toHaveLength(4)
  })

  it('should not be able to return a member tha didnt accept the list invitation', async () => {
    const [testList] = createTestLists(1).map((list) => {
      listsRepository.items.push(list)

      return list
    })

    createTestUsers(8).forEach((user, index) => {
      usersRepository.items.push(user)

      let acceptedAt: Date | null = new Date()

      if (index >= 4) {
        acceptedAt = null
      }

      membersRepository.items.push({
        id: `member-${index + 1}`,
        list_id: testList.id,
        user_id: user.id,
        accepted_at: acceptedAt,
      })
    })

    const { lists } = await sut.execute({ query: '', page: 1 })

    expect(lists).toHaveLength(1)
    expect(lists[0].members).toHaveLength(4)
  })
})
