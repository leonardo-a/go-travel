import { makeSendFriendRequestUseCase } from '@/use-cases/factories/make-send-friend-request'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function send(request: FastifyRequest, reply: FastifyReply) {
  const sendBodySchema = z.object({
    username: z.string(),
  })

  const { username } = sendBodySchema.parse(request.body)

  const sendUseCase = makeSendFriendRequestUseCase()

  const { friend } = await sendUseCase.execute({
    userId: request.user.sub,
    username,
  })

  return reply.status(201).send({
    friend,
  })
}
