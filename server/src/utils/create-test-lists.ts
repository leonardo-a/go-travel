import { List } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function createTestLists(quantity: number) {
  const lists: List[] = []

  for (let i = 0; i < quantity; i++) {
    lists.push({
      id: randomUUID(),
      owner_id: 'user-1',
      name: `Test List ${i + 1}`,
      cover_photo: null,
      created_at: new Date(),
    })
  }

  return lists
}
