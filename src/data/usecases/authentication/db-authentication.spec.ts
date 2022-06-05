import { DbAuthentication } from './db-authentication'
import {
  AuthenticationModel,
  HashCompare,
  TokenGenerator,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  AccountModel
} from './db-authentication-protocols'

describe('DbAuthentication UseCase', () => {
  const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel | null> { return makeFakeAccount() }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeHashCompareStub = (): HashCompare => {
    class HashCompareStub implements HashCompare {
      async compare (value: string, hash: string): Promise<boolean> { return true }
    }
    return new HashCompareStub()
  }

  const makeTokenGeneratorStub = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
      async generate (id: string): Promise<string> { return 'valid_token' }
    }
    return new TokenGeneratorStub()
  }

  const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async updateAccessToken (id: string, token: string): Promise<void> { }
    }
    return new UpdateAccessTokenRepositoryStub()
  }

  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashCompare
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const hashComparerStub = makeHashCompareStub()
    const tokenGeneratorStub = makeTokenGeneratorStub()
    const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
    const sut = new DbAuthentication(
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub
    )
    return {
      sut,
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      tokenGeneratorStub,
      updateAccessTokenRepositoryStub
    }
  }

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'hashed_password'
  })

  const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.login(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockImplementationOnce(() => { throw new Error() })
    const result = sut.login(makeFakeAuthentication())
    await expect(result).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository retuns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockResolvedValueOnce(null)
    const token = await sut.login(makeFakeAuthentication())
    expect(token).toBeNull()
  })

  test('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const authAccount = makeFakeAuthentication()
    await sut.login(authAccount)
    expect(compareSpy).toBeCalledWith(authAccount.password, 'hashed_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => { throw new Error() })
    const result = sut.login(makeFakeAuthentication())
    await expect(result).rejects.toThrow()
  })

  test('should return null if HashComparer retuns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const token = await sut.login(makeFakeAuthentication())
    expect(token).toBeNull()
  })

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const authAccount = makeFakeAuthentication()
    await sut.login(authAccount)
    expect(tokenGeneratorSpy).toBeCalledWith('any_id')
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => { throw new Error() })
    const result = sut.login(makeFakeAuthentication())
    await expect(result).rejects.toThrow()
  })

  test('should return a token if HashComparer retuns a token', async () => {
    const { sut } = makeSut()
    const token = await sut.login(makeFakeAuthentication())
    expect(token).toEqual('valid_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authAccount = makeFakeAuthentication()
    await sut.login(authAccount)
    expect(updateSpy).toBeCalledWith('any_id', 'valid_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(() => { throw new Error() })
    const result = sut.login(makeFakeAuthentication())
    await expect(result).rejects.toThrow()
  })
})
