import { makeRegisterTravelUseCase } from '@/use-cases/factories/make-register-travel-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    destination: z.string(),
    country: z.string(),
    startAt: z.coerce.date(),
    costs: z.number().optional(),
    duration: z.number().default(1),
    coverUrl: z.string().url().optional(),
  })

  const registerParamsSchema = z.object({
    listId: z.string().uuid(),
  })

  const { destination, country, duration, startAt, costs, coverUrl } =
    registerBodySchema.parse(request.body)
  const { listId } = registerParamsSchema.parse(request.params)

  const registerUseCase = makeRegisterTravelUseCase()

  const { travel } = await registerUseCase.execute({
    listId,
    userId: request.user.sub,
    destination,
    country,
    startAt,
    costs,
    cover: coverUrl,
    duration,
  })

  return reply.status(201).send({
    travel,
  })
}
