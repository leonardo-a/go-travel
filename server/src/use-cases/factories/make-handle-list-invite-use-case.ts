import { PrismaMembersRepository } from '@/repositories/prisma/prisma-members-repository'
import { HandleListInviteUseCase } from '../domains/members/handle-list-invites'

export function makeHandleListInviteUseCase() {
  const membersRepository = new PrismaMembersRepository()

  const useCase = new HandleListInviteUseCase(membersRepository)

  return useCase
}
