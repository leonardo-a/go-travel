import { beforeEach, describe, expect, it } from 'vitest'

import { FetchTravelsUseCase } from './fetch-travels'
import { InMemoryTravelsRepository } from '@/repositories/in-memory/in-memory-travels-repository'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

import { createTestTravels } from '@/utils/create-test-travels'
import { createTestLists } from '@/utils/create-test-lists'

let travelsRepository: InMemoryTravelsRepository
let listsRepository: InMemoryListsRepository
let sut: FetchTravelsUseCase

describe('Get Travels Use Case', () => {
  beforeEach(() => {
    travelsRepository = new InMemoryTravelsRepository()
    listsRepository = new InMemoryListsRepository()
    sut = new FetchTravelsUseCase(travelsRepository, listsRepository)
  })

  it('should be able to get travels from a list', async () => {
    const [list] = createTestLists(1).map((list) => {
      listsRepository.items.push(list)

      return list
    })

    createTestTravels(3, list.id).forEach((travel) => {
      travelsRepository.items.push(travel)
    })

    const { travels } = await sut.execute({ listId: list.id })

    expect(travels).toHaveLength(3)
  })

  it('should not be able to get travels from a non-existent list', async () => {
    await expect(() =>
      sut.execute({ listId: 'invalid-list' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
