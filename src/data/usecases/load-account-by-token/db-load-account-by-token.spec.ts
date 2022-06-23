import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

describe('DbLoadAccountByToken', () => {
  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeDecrypterStub = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return 'any_value'
      }
    }
    return new DecrypterStub()
  }

  const makeLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
      async loadByToken (token: string, role?: string): Promise<AccountModel> {
        return makeFakeAccount()
      }
    }
    return new LoadAccountByTokenRepositoryStub()
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = makeDecrypterStub()
    const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepositoryStub()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
      sut,
      decrypterStub,
      loadAccountByTokenRepositoryStub
    }
  }

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'hashed_password'
  })

  test('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.loadByToken('any_token', 'any_role')
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const response = await sut.loadByToken('any_token')
    expect(response).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.loadByToken('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
