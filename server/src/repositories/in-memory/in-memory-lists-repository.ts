import { randomUUID } from 'node:crypto'
import { List, Prisma } from '@prisma/client'

import { ListsRepository } from '../lists-repository'

export class InMemoryListsRepository implements ListsRepository {
  public items: List[] = []

  async create(data: Prisma.ListUncheckedCreateInput): Promise<List> {
    const list: List = {
      id: randomUUID(),
      owner_id: data.owner_id,
      name: data.name,
      cover_photo: data.cover_photo || null,
      created_at: new Date(),
    }

    this.items.push(list)

    return list
  }

  async findById(id: string): Promise<List | null> {
    const list = this.items.find((item) => item.id === id)

    if (!list) {
      return null
    }

    return list
  }

  async fetchMany(
    userId: string,
    query: string,
    page: number,
  ): Promise<List[]> {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
}
