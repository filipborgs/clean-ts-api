import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_string')
  }
}))

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const salt = 12
    const param = 'value'
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt(param)
    expect(hashSpy).toHaveBeenCalledWith(param, salt)
  })

  it('should return a hash on sucess', async () => {
    const sut = new BcryptAdapter(12)
    const hash = await sut.encrypt('any_string')
    expect(hash).toBe('hashed_string')
  })
})
