import { InMemoryTravelsRepository } from '@/repositories/in-memory/in-memory-travels-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchUpcomingTravelsUseCase } from './fetch-upcoming-travels'
import { createTestTravels } from '@/utils/create-test-travels'

let travelsRepository: InMemoryTravelsRepository
let sut: FetchUpcomingTravelsUseCase

describe('Fetch Near Travels Use Case', () => {
  beforeEach(() => {
    travelsRepository = new InMemoryTravelsRepository()
    sut = new FetchUpcomingTravelsUseCase(travelsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get travels with closest start date', async () => {
    createTestTravels(4, 'list-1').forEach((travel, index) => {
      // A cada item da lista, a data de inicio é mudada pra um dia anterior
      // isso serve para que o ultimo item criado seja o com a data de inicio mais próxima
      vi.setSystemTime(new Date(2023, 0, 20 - index, 6, 0, 0))
      travel.start_date = new Date()

      travelsRepository.items.push(travel)
    })

    const { travels } = await sut.execute({ userId: 'user-1' })

    expect(travels).toHaveLength(4)
    expect(travels[0].destination).toEqual('Destination 4')
  })
})
