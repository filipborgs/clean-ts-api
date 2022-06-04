import { AuthenticationModel } from '../../../domain/use-cases/authentication'
import { HashCompare } from '../../protocols/criptography/hash-compare'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel | null> { return makeFakeAccount() }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeHashCompareStub = (): HashCompare => {
    class HashCompareStub implements HashCompare {
      compare (value: string, hash: string): boolean { return true }
    }
    return new HashCompareStub()
  }

  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashCompare
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const hashComparerStub = makeHashCompareStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
    return {
      sut,
      loadAccountByEmailRepositoryStub,
      hashComparerStub
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
})
