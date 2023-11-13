import { makeGetTravelUseCase } from '@/use-cases/factories/make-get-travel-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const detailsParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = detailsParamsSchema.parse(request.params)

  const detailsUseCase = makeGetTravelUseCase()

  const { travel, list } = await detailsUseCase.execute({ travelId: id })

  return reply.send({
    travel: {
      ...travel,
      list,
    },
  })
}
