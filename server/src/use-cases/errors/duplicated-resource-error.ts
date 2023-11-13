export class DuplicatedResourceError extends Error {
  constructor() {
    super('Resource couldnt be created because it already exists.')
  }
}
