import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeHandleListInviteUseCase } from '@/use-cases/factories/make-handle-list-invite-use-case'

export async function handle(request: FastifyRequest, reply: FastifyReply) {
  const handleBodySchema = z.object({
    inviteId: z.string().uuid(),
    accepted: z.boolean(),
  })

  const { inviteId, accepted } = handleBodySchema.parse(request.body)

  const handleUseCase = makeHandleListInviteUseCase()

  await handleUseCase.execute({
    userId: request.user.sub,
    memberId: inviteId,
    accepted,
  })

  return reply.send()
}
