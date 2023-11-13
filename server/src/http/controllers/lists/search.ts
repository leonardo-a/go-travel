import { makeFetchListsUseCase } from '@/use-cases/factories/make-fetch-lists-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    q: z.string().default(''),
    page: z.coerce.number().default(1),
    accepted: z.enum(['true', 'false']).default('true'),
  })

  const { q, page, accepted } = searchQuerySchema.parse(request.query)

  const searchUseCase = makeFetchListsUseCase()

  const { lists } = await searchUseCase.execute({
    userId: request.user.sub,
    query: q,
    page,
    isAccepted: accepted === 'true',
  })

  return reply.send({
    lists,
  })
}
