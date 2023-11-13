import { Member, Prisma } from '@prisma/client'
import { MembersRepository } from '../members-repository'
import { prisma } from '@/libs/prisma'

export class PrismaMembersRepository implements MembersRepository {
  async create(data: Prisma.MemberUncheckedCreateInput): Promise<Member> {
    const member = await prisma.member.create({
      data,
    })

    return member
  }

  async createMany(
    listId: string,
    users: string[],
    forceAccept?: boolean,
  ): Promise<number> {
    const data = users.map((userId) => {
      return {
        user_id: userId,
        list_id: listId,
        accepted_at: forceAccept ? new Date() : undefined,
      }
    })

    const memberCreated = await prisma.member.createMany({
      data,
    })

    return memberCreated.count
  }

  async findById(id: string): Promise<Member | null> {
    const member = await prisma.member.findUnique({
      where: {
        id,
      },
    })

    return member
  }

  async fetchByList(listId: string, accepted: boolean): Promise<Member[]> {
    const members = await prisma.member.findMany({
      where: {
        list_id: listId,
        accepted_at: accepted ? { not: null } : undefined,
      },
    })

    return members
  }

  async fetchByLists(listsIds: string[], accepted: boolean): Promise<Member[]> {
    const members = await prisma.member.findMany({
      where: {
        list_id: {
          in: listsIds,
        },
        accepted_at: accepted ? { not: null } : undefined,
      },
    })

    return members
  }

  async edit(data: Member): Promise<Member> {
    const member = await prisma.member.update({
      where: {
        id: data.id,
      },
      data,
    })

    return member
  }

  async delete(data: Member) {
    const member = await prisma.member.delete({
      where: {
        id: data.id,
      },
    })

    return member
  }
}
