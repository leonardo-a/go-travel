import { makeFetchTravelsUseCase } from '@/use-cases/factories/make-fetch-travels-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function listTravels(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const listTravelsParamsSchema = z.object({
    listId: z.string().uuid(),
  })

  const { listId } = listTravelsParamsSchema.parse(request.params)

  const listTravelsUseCase = makeFetchTravelsUseCase()

  const { travels } = await listTravelsUseCase.execute({
    listId,
  })

  return reply.send({
    travels,
  })
}
