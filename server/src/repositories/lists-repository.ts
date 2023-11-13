import { List, Prisma } from '@prisma/client'

export interface ListsRepository {
  create(data: Prisma.ListUncheckedCreateInput): Promise<List>

  findById(id: string): Promise<List | null>

  fetchMany(userId: string, query: string, page: number): Promise<List[]>
}
