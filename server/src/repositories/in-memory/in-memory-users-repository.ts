import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      username: data.username,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role || 'USER',
      status: data.status || null,
    }

    this.items.push(user)

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find((item) => item.username === username)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async fetchMany(
    query: string,
    page: number,
    userId: string,
  ): Promise<User[]> {
    return this.items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.username.toLowerCase().includes(query),
      )
      .slice((page - 1) * 20, page * 20)
  }

  async fetchByIds(ids: string[]): Promise<User[]> {
    return this.items.filter((item) => ids.includes(item.id))
  }

  async fetchByUsernames(usernames: string[]): Promise<User[]> {
    return this.items.filter((item) => usernames.includes(item.id))
  }
}
