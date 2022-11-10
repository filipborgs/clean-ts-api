import { Decrypter, HashCompare, Hasher, TokenGenerator } from '@/data/protocols/criptography'

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

export const mockHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> { return true }
  }
  return new HashCompareStub()
}

export const mockHasher = (): Hasher => {
  class EncryptStub implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashed_value'
    }
  }
  return new EncryptStub()
}

export const mockTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> { return 'valid_token' }
  }
  return new TokenGeneratorStub()
}
