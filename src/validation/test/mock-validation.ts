import { Validation } from '@/presentation/protocols'

export const mockValidationStub = (): Validation => {
  class FakeValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new FakeValidationStub()
}
