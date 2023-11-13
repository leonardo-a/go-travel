import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { search } from './search'
import { handle } from './handle'
import { send } from './send'

export async function friendsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/friends/search', search)
  app.patch('/friends/request', handle)
  app.post('/friends/request', send)
}
