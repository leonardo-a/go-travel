export class UsernameInUseError extends Error {
  constructor() {
    super('Username is already in use by another user, try other.')
  }
}
