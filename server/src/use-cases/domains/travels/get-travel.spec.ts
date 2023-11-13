import { beforeEach, describe, expect, it } from 'vitest'
import { GetTravelUseCase } from './get-travel'
import { InMemoryTravelsRepository } from '@/repositories/in-memory/in-memory-travels-repository'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { createTestLists } from '@/utils/create-test-lists'
import { createTestUsers } from '@/utils/create-test-users'
import { createTestTravels } from '@/utils/create-test-travels'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let travelsRepository: InMemoryTravelsRepository
let listsRepository: InMemoryListsRepository
let membersRepository: InMemoryMembersRepository
let usersRepository: InMemoryUsersRepository
let sut: GetTravelUseCase

describe('Get Travel Use Case', () => {
  beforeEach(() => {
    travelsRepository = new InMemoryTravelsRepository()
    listsRepository = new InMemoryListsRepository()
    membersRepository = new InMemoryMembersRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetTravelUseCase(
      travelsRepository,
      listsRepository,
      membersRepository,
      usersRepository,
    )
  })

  it('should be able to get the details from a travel', async () => {
    const [{ id: listId, name: listName }] = createTestLists(1).map((list) => {
      listsRepository.items.push(list)

      return list
    })

    createTestUsers(5).forEach((user, index) => {
      usersRepository.items.push(user)

      membersRepository.items.push({
        id: `member-${index}`,
        user_id: user.id,
        list_id: listId,
        accepted_at: new Date(),
      })
    })

    const [{ id: travelId }] = createTestTravels(1, listId).map((travel) => {
      travelsRepository.items.push(travel)

      return travel
    })

    const { travel, list } = await sut.execute({ travelId })

    expect(travel.id).toEqual(travelId)
    expect(list.name).toEqual(listName)
    expect(list.members).toHaveLength(5)
  })

  it('should not be able to get details from non-existent travel', async () => {
    await expect(() =>
      sut.execute({ travelId: 'invalid-travel' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
