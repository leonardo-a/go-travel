import { beforeEach, describe, expect, it } from 'vitest'
import { HandleListInviteUseCase } from './handle-list-invites'
import { InMemoryMembersRepository } from '@/repositories/in-memory/in-memory-member-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'

let membersRepository: InMemoryMembersRepository
let sut: HandleListInviteUseCase

describe('Handle List Invite Use Case', async () => {
  beforeEach(() => {
    membersRepository = new InMemoryMembersRepository()
    sut = new HandleListInviteUseCase(membersRepository)
  })

  it('should be able to accept a list invitation', async () => {
    membersRepository.items.push({
      id: 'invite-1',
      list_id: 'list-1',
      user_id: 'user-1',
      accepted_at: null,
    })

    const { member } = await sut.execute({
      userId: 'user-1',
      memberId: 'invite-1',
      accepted: true,
    })

    expect(member.accepted_at).toBeInstanceOf(Date)
  })

  it('should be able to deny a list invitation', async () => {
    membersRepository.items.push({
      id: 'invite-1',
      list_id: 'list-1',
      user_id: 'user-1',
      accepted_at: null,
    })

    const { member } = await sut.execute({
      userId: 'user-1',
      memberId: 'invite-1',
      accepted: false,
    })

    expect(membersRepository.items).toHaveLength(0)
  })

  it('should not be able to accept non-existent list invitation', async () => {
    await expect(() =>
      sut.execute({ userId: 'user-1', memberId: 'member-1', accepted: true }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to let only the user that receive the request accept it', async () => {
    membersRepository.items.push({
      id: 'invite-1',
      list_id: 'list-1',
      user_id: 'user-1',
      accepted_at: null,
    })

    await expect(() =>
      sut.execute({ userId: 'user-2', memberId: 'invite-1', accepted: true }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
