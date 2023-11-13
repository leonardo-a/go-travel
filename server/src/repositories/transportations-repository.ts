import { Prisma, Transportation } from '@prisma/client'

export interface TransportationsRepository {
  create(data: Prisma.TransportationCreateInput): Promise<Transportation>

  fetchMany(): Promise<Transportation>
}
