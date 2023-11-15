import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { search } from './search'
import { create } from './create'
import { details } from './details'
import { upload } from './upload'

export async function listsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/lists/:id', details)
  app.get('/lists/search', search)
  app.post('/lists', create)
  app.post('/lists/upload', upload)
}
