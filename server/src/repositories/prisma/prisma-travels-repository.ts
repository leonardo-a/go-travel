import { Prisma, Travel } from '@prisma/client'
import { TravelsRepository } from '../travels-repository'
import { prisma } from '@/libs/prisma'

export class PrismaTravelsRepository implements TravelsRepository {
  async create(data: Prisma.TravelUncheckedCreateInput): Promise<Travel> {
    const travel = await prisma.travel.create({
      data,
    })

    return travel
  }

  async findById(id: string): Promise<Travel | null> {
    const travel = await prisma.travel.findUnique({
      where: {
        id,
      },
    })

    return travel
  }

  async fetchByList(listId: string): Promise<Travel[]> {
    const travels = await prisma.travel.findMany({
      where: {
        list_id: listId,
      },
    })

    return travels
  }

  async fetchMany(
    userId: string,
    query: string,
    page: number,
    upcoming?: boolean,
  ): Promise<Travel[]> {
    const limit = upcoming ? 5 : 20

    const travels = await prisma.travel.findMany({
      where: {
        OR: [
          {
            destination: {
              contains: query,
            },
          },
          {
            country: {
              contains: query,
            },
          },
        ],
        list: {
          Member: {
            some: {
              user_id: userId,
            },
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: upcoming
        ? {
            start_date: 'asc',
          }
        : {
            updated_at: 'desc',
          },
    })

    return travels
  }
}
