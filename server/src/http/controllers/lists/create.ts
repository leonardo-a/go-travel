import { makeCreateListUseCase } from '@/use-cases/factories/make-create-list-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    name: z.string(),
    members: z.string().uuid().array().optional(),
    cover: z.string().url().optional(),
  })

  const { name, members, cover } = createBodySchema.parse(request.body)

  const createUseCase = makeCreateListUseCase()

  const { list } = await createUseCase.execute({
    name,
    userId: request.user.sub,
    cover,
    members,
  })

  return reply.status(201).send({
    list,
  })
}
