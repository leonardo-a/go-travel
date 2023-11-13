import { Member, Prisma } from '@prisma/client'
import { MembersRepository } from '../members-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryMembersRepository implements MembersRepository {
  public items: Member[] = []

  async create(data: Prisma.MemberUncheckedCreateInput): Promise<Member> {
    const member: Member = {
      id: randomUUID(),
      list_id: data.list_id,
      user_id: data.user_id,
      accepted_at: null,
    }

    this.items.push(member)

    return member
  }

  async createMany(listId: string, users: string[]): Promise<number> {
    let count = 0

    users.forEach((user) => {
      const member: Member = {
        id: randomUUID(),
        list_id: listId,
        user_id: user,
        accepted_at: null,
      }

      this.items.push(member)

      count++
    })

    return count
  }

  async findById(id: string): Promise<Member | null> {
    const member = this.items.find((item) => item.id === id)

    if (!member) {
      return null
    }

    return member
  }

  async fetchByList(listId: string, accepted: boolean): Promise<Member[]> {
    return this.items.filter((item) =>
      item.list_id === listId && accepted
        ? item.accepted_at !== null
        : item.accepted_at === null,
    )
  }

  async fetchByLists(listsIds: string[], accepted: boolean): Promise<Member[]> {
    return this.items.filter((item) =>
      listsIds.includes(item.list_id) && accepted
        ? item.accepted_at !== null
        : item.accepted_at === null,
    )
  }

  async edit(data: Member): Promise<Member> {
    const memberIndex = this.items.findIndex((item) => item.id === data.id)

    this.items[memberIndex] = data

    return this.items[memberIndex]
  }

  async delete(data: Member): Promise<Member> {
    const memberIndex = this.items.findIndex((item) => item.id === data.id)

    this.items.splice(memberIndex, 1)

    return data
  }
}
