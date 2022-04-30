export class ServerError extends Error {
  constructor (stack: string | undefined) {
    super('Server error')
    super.name = 'ServerError'
    super.stack = stack
  }
}
