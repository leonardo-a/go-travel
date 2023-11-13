import { makeGetFriendsUseCase } from '@/use-cases/factories/make-get-friends-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    q: z.string().default(''),
    page: z.coerce.number().default(1),
    accepted: z.enum(['true', 'false']).default('true'),
    received: z.enum(['true', 'false']).default('false'),
  })

  const { q, page, received, accepted } = searchQuerySchema.parse(request.query)

  const searchUseCase = makeGetFriendsUseCase()

  const { friends } = await searchUseCase.execute({
    userId: request.user.sub,
    query: q,
    page,
    received: received === 'true',
    accepted: accepted === 'true',
  })

  return reply.send({
    friends,
  })
}
