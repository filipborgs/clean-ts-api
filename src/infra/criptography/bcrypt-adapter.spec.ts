import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_string')
  },
  async compare (value: string, hash: string): Promise<boolean> {
    return true
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const param = 'value'
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash(param)
    expect(hashSpy).toHaveBeenCalledWith(param, salt)
  })

  it('should return a hash on sucess', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_string')
    expect(hash).toBe('hashed_string')
  })

  it('shoud throw if bcrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => { throw new Error() })
    const sut = makeSut()
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  it('should call compare with correct values', async () => {
    const value = 'value'
    const hash = 'hash'
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare(value, hash)
    expect(compareSpy).toHaveBeenCalledWith(value, hash)
  })
})
