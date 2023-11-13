import { makeFetchUpcomingTravelsUseCase } from '@/use-cases/factories/make-fetch-upcoming-travels-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function upcoming(request: FastifyRequest, reply: FastifyReply) {
  const upcomingUseCase = makeFetchUpcomingTravelsUseCase()

  const { travels } = await upcomingUseCase.execute({
    userId: request.user.sub,
  })

  return reply.send({
    travels,
  })
}
