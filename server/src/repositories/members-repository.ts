import { Member, Prisma } from '@prisma/client'

export interface MembersRepository {
  create(data: Prisma.MemberUncheckedCreateInput): Promise<Member>
  createMany(
    listId: string,
    users: string[],
    forceAccept?: boolean,
  ): Promise<number>
  findById(id: string): Promise<Member | null>
  edit(data: Member): Promise<Member>
  delete(data: Member): Promise<Member>
  fetchByList(listId: string, accepted: boolean): Promise<Member[]>
  fetchByLists(listsIds: string[], accepted: boolean): Promise<Member[]>
}
