import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { upcoming } from './upcoming'
import { details } from './details'
import { register } from './register'
import { listTravels } from './list-travels'
import { upload } from './upload'

export async function travelsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/travels', upcoming)
  app.get('/travels/:id', details)
  app.post('/travels/upload', upload)
  app.post('/lists/:listId/travels', register)
  app.get('/lists/:listId/travels', listTravels)
}
