import { makeAuthenticateUseCase } from '@/use-cases/factories/make-autenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function auth(request: FastifyRequest, reply: FastifyReply) {
  const authBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = authBodySchema.parse(request.body)

  const authUseCase = makeAuthenticateUseCase()

  const { user } = await authUseCase.execute({
    email,
    password,
  })

  const token = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  return reply.status(200).send({
    token,
  })
}
