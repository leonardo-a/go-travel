import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetListUseCase } from './get-list'
import { createTestUsers } from '@/utils/create-test-users'
import { createTestLists } from '@/utils/create-test-lists'

let listsRepository: InMemoryListsRepository
let membersRepository: InMemoryMembersRepository
let sut: GetListUseCase

describe('Get List Use Case', () => {
  beforeEach(() => {
    listsRepository = new InMemoryListsRepository()
    membersRepository = new InMemoryMembersRepository()
    sut = new GetListUseCase(listsRepository, membersRepository)
  })

  it('should be able to get a list by id', async () => {
    const [list] = createTestLists(1)

    listsRepository.items.push(list)

    const members = createTestUsers(2).map((member, index) => {
      membersRepository.items.push({
        id: `member-${index + 1}`,
        list_id: list.id,
        user_id: member.id,
        accepted_at: new Date(),
      })

      return member
    })

    const { list: foundList } = await sut.execute({
      listId: list.id,
      userId: members[0].id,
    })

    expect(foundList.id).toEqual(list.id)
  })
})
