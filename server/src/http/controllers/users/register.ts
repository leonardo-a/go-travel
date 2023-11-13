import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    username: z.custom<string>((val) => {
      return typeof val === 'string' ? /^[a-z0-9_-]+$/g.test(val) : false
    }),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  //

  const { username, name, email, password } = registerBodySchema.parse(
    request.body,
  )

  const registerUseCase = makeRegisterUseCase()

  const { user } = await registerUseCase.execute({
    username,
    name,
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

  return reply.status(201).send({
    token,
  })
}
