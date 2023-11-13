import { z } from 'zod'

export function validateEmail(value: string) {
  const emailSchema = z.string().email()

  try {
    emailSchema.parse(value)

    return true
  } catch (err) {
    return false
  }
}
