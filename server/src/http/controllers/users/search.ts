import { makeFetchUsersUseCase } from '@/use-cases/factories/make-fetch-users-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    q: z.string().default(''),
    page: z.coerce.number().default(1),
  })

  const { q, page } = searchQuerySchema.parse(request.query)

  const searchUseCase = makeFetchUsersUseCase()

  const { users: usersFound } = await searchUseCase.execute({
    query: q,
    page,
    userId: request.user.sub,
  })

  const users = usersFound.map(({ id, name, username, status }) => {
    return {
      id,
      name,
      username,
      status,
    }
  })

  return reply.send({
    users,
  })
}
