import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_string')
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const param = 'value'
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(param)
    expect(hashSpy).toHaveBeenCalledWith(param, salt)
  })

  it('should return a hash on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt('any_string')
    expect(hash).toBe('hashed_string')
  })
})
