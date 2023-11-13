import { makeGetListUseCase } from '@/use-cases/factories/make-get-list-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const detailsParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = detailsParamsSchema.parse(request.params)

  const detailsUseCase = makeGetListUseCase()

  const { list } = await detailsUseCase.execute({
    listId: id,
    userId: request.user.sub,
  })

  return reply.send({
    list,
  })
}
