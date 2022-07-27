import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return 'valid_token'
  },
  verify: async (): Promise<string> => {
    return 'any_value'
  }
}))

describe('JWT Adapter', () => {
  const secret = 'secret'
  const makeSut = (): JwtAdapter => {
    return new JwtAdapter(secret)
  }

  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.generate('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
    })

    test('Should return a token on sign sucess', async () => {
      const sut = makeSut()
      const jwt = await sut.generate('any_id')
      expect(jwt).toEqual('valid_token')
    })

    it('shoud throw if sign throws', async () => {
      jest.spyOn(jwt, 'sign').mockImplementation(() => { throw new Error() })
      const sut = makeSut()
      const promise = sut.generate('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const param = 'value'
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(param)
      expect(verifySpy).toHaveBeenCalledWith(param, secret)
    })

    test('Should return a value on verify sucess', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')
      expect(value).toEqual('any_value')
    })

    it('shoud throw if verify throws', async () => {
      jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error() })
      const sut = makeSut()
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
