import { makeRegisterMembersUseCase } from '@/use-cases/factories/make-register-members-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    users: z.string().uuid().array(),
  })

  const registerParamsSchema = z.object({
    listId: z.string().uuid(),
  })

  const { users } = registerBodySchema.parse(request.body)
  const { listId } = registerParamsSchema.parse(request.params)

  const registerUseCase = makeRegisterMembersUseCase()

  const { done } = await registerUseCase.execute({
    listId,
    owner: request.user.sub,
    users,
  })

  return reply.status(201).send({
    done,
  })
}
