import { Prisma, Travel } from '@prisma/client'

export interface TravelsRepository {
  create(data: Prisma.TravelUncheckedCreateInput): Promise<Travel>

  findById(id: string): Promise<Travel | null>

  fetchByList(listId: string): Promise<Travel[]>

  fetchMany(
    userId: string,
    query: string,
    page: number,
    order?: boolean,
  ): Promise<Travel[]>
}
