import { Preferences, Prisma } from '@prisma/client'

export interface PreferencesRepository {
  create(data: Prisma.PreferencesUncheckedCreateInput): Promise<Preferences>

  update(data: Prisma.PreferencesUpdateInput): Promise<Preferences>
}
