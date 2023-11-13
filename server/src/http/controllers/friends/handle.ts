import { makeHandleFriendRequestUseCase } from '@/use-cases/factories/make-handle-friend-request-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function handle(request: FastifyRequest, reply: FastifyReply) {
  const handleBodySchema = z.object({
    friendRequestId: z.string().uuid(),
    accepted: z.boolean(),
  })

  const { friendRequestId, accepted } = handleBodySchema.parse(request.body)

  const handleUseCase = makeHandleFriendRequestUseCase()

  await handleUseCase.execute({
    userId: request.user.sub,
    friendRequestId,
    accepted,
  })

  return reply.status(204).send()
}
