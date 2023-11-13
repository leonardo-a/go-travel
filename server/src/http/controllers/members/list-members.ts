import { makeGetMembersUseCase } from '@/use-cases/factories/make-get-members-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listMembers(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listParamsSchema = z.object({
    listId: z.string().uuid(),
  })

  const listQuerySchema = z.object({
    accepted: z.enum(['true', 'false']).default('true'),
  })

  const { listId } = listParamsSchema.parse(request.params)
  const { accepted } = listQuerySchema.parse(request.query)

  const listUseCase = makeGetMembersUseCase()

  const { members } = await listUseCase.execute({
    listId,
    accepted: accepted === 'true',
  })

  return reply.send({
    members,
  })
}
