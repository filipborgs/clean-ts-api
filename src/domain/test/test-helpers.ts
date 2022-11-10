export const throwError = Error('error')
export const mockThrowError = (): never => { throw throwError }
