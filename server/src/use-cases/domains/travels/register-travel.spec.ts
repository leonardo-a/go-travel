import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterTravelUseCase } from './register-travel'
import { InMemoryTravelsRepository } from '@/repositories/in-memory/in-memory-travels-repository'
import { InMemoryListsRepository } from '@/repositories/in-memory/in-memory-lists-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'

let travelsRepository: InMemoryTravelsRepository
let listsRepository: InMemoryListsRepository
let sut: RegisterTravelUseCase

describe('Register Travel Use Case', () => {
  beforeEach(() => {
    travelsRepository = new InMemoryTravelsRepository()
    listsRepository = new InMemoryListsRepository()
    sut = new RegisterTravelUseCase(travelsRepository, listsRepository)
  })

  it('should be able to register a travel to a list', async () => {
    listsRepository.items.push({
      id: 'list-1',
      name: 'Test List',
      owner_id: 'user-1',
      cover_photo: null,
      created_at: new Date(),
    })

    const { travel } = await sut.execute({
      listId: 'list-1',
      userId: 'user-1',
      destination: 'Mount Fuji',
      country: 'Japan',
      startAt: new Date(),
    })

    expect(travel.id).toEqual(expect.any(String))
  })

  it('should not be able to register a travel to a non-existent list', async () => {
    await expect(() =>
      sut.execute({
        listId: 'list-1',
        userId: 'user-1',
        destination: 'Mount Fuji',
        country: 'Japan',
        startAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to register a travel if user is not the owner of the list', async () => {
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
        userId: 'user-2',
        destination: 'Mount Fuji',
        country: 'Japan',
        startAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
