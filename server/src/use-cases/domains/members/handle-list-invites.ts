import { Member } from '@prisma/client'
import { MembersRepository } from '@/repositories/members-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'

interface HandleListInviteUseCaseRequest {
  memberId: string
  userId: string
  accepted: boolean
}

interface HandleListInviteUseCaseResponse {
  member: Member
}

export class HandleListInviteUseCase {
  constructor(private membersRepository: MembersRepository) {}

  async execute({
    memberId,
    userId,
    accepted,
  }: HandleListInviteUseCaseRequest): Promise<HandleListInviteUseCaseResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      throw new ResourceNotFoundError()
    }

    if (member.user_id !== userId) {
      throw new UnauthorizedError()
    }

    if (!accepted) {
      const removedMember = await this.membersRepository.delete(member)

      return {
        member: removedMember,
      }
    }

    if (member.accepted_at) {
      return {
        member,
      }
    }

    member.accepted_at = new Date()

    const updatedMember = await this.membersRepository.edit(member)

    return {
      member: updatedMember,
    }
  }
}
