import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { prisma } from '@/libs/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    return user
  }

  async fetchMany(query: string, page: number, userId: string) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            username: {
              contains: query,
            },
          },
        ],
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return users
  }

  async fetchByIds(ids: string[]) {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    })

    return users
  }

  async fetchByUsernames(usernames: string[]) {
    const users = await prisma.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
    })

    return users
  }
}
