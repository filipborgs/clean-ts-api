import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
describe('DbLoadAccountByToken', () => {
  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
  }

  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return 'any_value'
      }
    }
    return new DecrypterStub()
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const sut = new DbLoadAccountByToken(decrypterStub)
    return {
      sut,
      decrypterStub
    }
  }
  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken('any_token')
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })
})
