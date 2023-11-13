import { User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function createTestUsers(quantity: number) {
  const users: User[] = []

  for (let i = 0; i < quantity; i++) {
    users.push({
      id: randomUUID(),
      username: `username-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@test.com`,
      password_hash: 'demo-password',
      role: 'USER',
      status: null,
    })
  }

  return users
}
