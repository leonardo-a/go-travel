import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { register } from './register'
import { listMembers } from './list-members'
import { handle } from './handle'

export async function membersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.patch('/lists/members/invite', handle)
  app.post('/lists/:listId/members', register)
  app.get('/lists/:listId/members', listMembers)
}
