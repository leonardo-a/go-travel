import * as Sentry from 'sentry-expo'

export function captureException(error: unknown) {
  return Sentry.Native.captureException(error)
}
