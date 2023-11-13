import { makeCheckUsernameUseCase } from '@/use-cases/factories/make-check-username-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function check(request: FastifyRequest, reply: FastifyReply) {
  const checkQuerySchema = z.object({
    username: z.string(),
  })

  const { username } = checkQuerySchema.parse(request.query)

  const checkUseCase = makeCheckUsernameUseCase()

  const { isAvailable } = await checkUseCase.excute({
    username,
  })

  return reply.send({
    isAvailable,
  })
}
