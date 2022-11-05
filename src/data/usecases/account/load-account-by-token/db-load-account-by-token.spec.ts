import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter, LoadAccountByTokenRepository, AccountModel }
  from './db-load-account-by-token-protocols'

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
    password: 'hashed_password',
    accessToken: 'any'
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
    const response = await sut.loadByToken('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct value', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.loadByToken('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const response = await sut.loadByToken('any_token', 'any_role')
    expect(response).toBeNull()
  })

  test('Should return an account if succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.loadByToken('any_token', 'any_role')
    expect(response).toEqual(makeFakeAccount())
  })

  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(() => { throw new Error() })
    const result = sut.loadByToken('any_token', 'any_role')
    await expect(result).rejects.toThrow()
  })

  test('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => { throw new Error() })
    const result = sut.loadByToken('any_token', 'any_role')
    await expect(result).rejects.toThrow()
  })
})
