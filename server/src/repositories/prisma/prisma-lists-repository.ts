import { List, Prisma } from '@prisma/client'
import { ListsRepository } from '../lists-repository'
import { prisma } from '@/libs/prisma'

export class PrismaListsRepository implements ListsRepository {
  async create(data: Prisma.ListUncheckedCreateInput): Promise<List> {
    const list = await prisma.list.create({
      data,
    })

    return list
  }

  async findById(id: string): Promise<List | null> {
    const list = await prisma.list.findUnique({
      where: {
        id,
      },
    })

    return list
  }

  async fetchMany(
    userId: string,
    query: string,
    page: number,
  ): Promise<List[]> {
    const lists = await prisma.list.findMany({
      where: {
        name: {
          contains: query,
        },
        Member: {
          some: {
            user_id: userId,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return lists
  }
}
