import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

describe('JWT Adapter', () => {
  const secret = 'secret'
  const makeSut = (): JwtAdapter => {
    return new JwtAdapter(secret)
  }
  test('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, secret)
  })
})
