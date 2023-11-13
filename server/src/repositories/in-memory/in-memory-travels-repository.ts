import { Prisma, Travel } from '@prisma/client'
import { TravelsRepository } from '../travels-repository'
import { randomUUID } from 'crypto'

export class InMemoryTravelsRepository implements TravelsRepository {
  public items: Travel[] = []

  async create(data: Prisma.TravelUncheckedCreateInput): Promise<Travel> {
    const travel: Travel = {
      id: randomUUID(),
      list_id: data.list_id,
      destination: data.destination,
      country: data.country,
      start_date: new Date(data.start_date),
      duration: data.duration || 1,
      costs: data.costs || null,
      cover_photo: data.cover_photo || null,
      transportation_id: data.transportation_id || null,
      completed_at: null,
      updated_at: new Date(),
    }

    this.items.push(travel)

    return travel
  }

  async findById(id: string): Promise<Travel | null> {
    const travel = this.items.find((item) => item.id === id)

    if (!travel) {
      return null
    }

    return travel
  }

  async fetchByList(listId: string): Promise<Travel[]> {
    return this.items.filter((item) => item.list_id === listId)
  }

  async fetchMany(
    userId: string,
    query: string,
    page: number,
  ): Promise<Travel[]> {
    return this.items
      .filter(
        (item) =>
          item.destination.includes(query) || item.country.includes(query),
      )
      .sort((a, b) => {
        // Ordenar por data mais perto
        return a.start_date.valueOf() - b.start_date.valueOf()
      })
      .slice((page - 1) * 20, page * 20)
  }
}
