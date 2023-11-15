import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { ZodError } from 'zod'
import { resolve } from 'node:path'

import { env } from './env'

import { UserAlreadyExistsError } from './use-cases/errors/user-already-exists-error'
import { UsernameInUseError } from './use-cases/errors/username-in-use-error'
import { InvalidCredentialError } from './use-cases/errors/invalid-credentials-error'
import { InvalidValuesError } from './use-cases/errors/invalid-values-error'
import { DuplicatedResourceError } from './use-cases/errors/duplicated-resource-error'
import { UnauthorizedError } from './use-cases/errors/unauthorized-error'
import { MustBeFriendsError } from './use-cases/errors/must-be-friends-error'
import { UserNotFoundError } from './use-cases/errors/user-not-found-error'
import { ResourceNotFoundError } from './use-cases/errors/resource-not-found-error'

import { friendsRoutes } from './http/controllers/friends/routes'
import { listsRoutes } from './http/controllers/lists/routes'
import { membersRoutes } from './http/controllers/members/routes'
import { travelsRoutes } from './http/controllers/travels/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

// Plugins
app.register(fastifyCors, {
  origin: true,
})
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(fastifyMultipart)
app.register(fastifyStatic, {
  root: resolve(__dirname, '../images'),
  prefix: '/images',
})

// Routes
app.register(usersRoutes)
app.register(listsRoutes)
app.register(membersRoutes)
app.register(travelsRoutes)
app.register(friendsRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.format(),
    })
  } else if (
    error instanceof UserAlreadyExistsError ||
    error instanceof UsernameInUseError ||
    error instanceof DuplicatedResourceError
  ) {
    return reply.status(409).send({
      message: error.message,
    })
  } else if (
    error instanceof InvalidCredentialError ||
    error instanceof UnauthorizedError
  ) {
    return reply.status(401).send({
      message: error.message,
    })
  } else if (
    error instanceof InvalidValuesError ||
    error instanceof DuplicatedResourceError ||
    error instanceof MustBeFriendsError
  ) {
    return reply.status(400).send({
      message: error.message,
    })
  } else if (
    error instanceof UserNotFoundError ||
    error instanceof ResourceNotFoundError
  ) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Create unknow errors logs using tools like: DataDog, NewRelic, Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
