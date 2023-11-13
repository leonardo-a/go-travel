import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { search } from './search'
import { create } from './create'
import { details } from './details'

export async function listsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/lists/:id', details)
  app.get('/lists/search', search)
  app.post('/lists', create)
}
