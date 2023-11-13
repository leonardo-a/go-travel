import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
  fetchMany(query: string, page: number, userId: string): Promise<User[]>
  fetchByIds(ids: string[]): Promise<User[]>
  fetchByUsernames(usernames: string[]): Promise<User[]>
}
