import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return 'valid_token'
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
})
