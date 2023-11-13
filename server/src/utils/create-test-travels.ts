import { Travel } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export function createTestTravels(quantity: number, listId: string) {
  const travels: Travel[] = []

  for (let i = 0; i < quantity; i++) {
    travels.push({
      id: randomUUID(),
      list_id: listId,
      destination: `Destination ${i + 1}`,
      country: 'Test',
      costs: null,
      duration: 1,
      transportation_id: 1,
      cover_photo: null,
      start_date: new Date(),
      completed_at: null,
      updated_at: new Date(),
    })
  }

  return travels
}
