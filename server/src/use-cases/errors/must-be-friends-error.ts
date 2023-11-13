export class MustBeFriendsError extends Error {
  constructor() {
    super('User must be in your friend list.')
  }
}
