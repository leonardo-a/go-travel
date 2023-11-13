import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { auth } from './auth'
import { register } from './register'
import { profile } from './profile'
import { check } from './check'
import { search } from './search'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/auth', auth)
  app.post('/register', register)
  app.get('/register/username', check)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.get('/users', { onRequest: [verifyJWT] }, search)
}
