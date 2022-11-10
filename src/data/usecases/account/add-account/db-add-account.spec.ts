import { mockAddAccountRepository, mockHasher } from '@/data/test'
import { mockAddAccountParams } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbAddAccount } from './db-add-account'
import { AccountModel, LoadAccountByEmailRepository, Hasher, AddAccountRepository } from './db-add-account-protocols'

interface SutTypes {
  sut: DbAddAccount
  hashStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const mockLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> { return null }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepositoryStub()
  const sut = new DbAddAccount(hashStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return { hashStub, sut, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount Usecase', () => {
  it('should call hash with correct values', async () => {
    const { sut, hashStub } = makeSut()
    const hashSpy = jest.spyOn(hashStub, 'hash')
    const accountData = mockAddAccountParams()
    await sut.add(accountData)

    expect(hashSpy).toBeCalledWith(accountData.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hashStub } = makeSut()
    jest.spyOn(hashStub, 'hash').mockImplementationOnce(mockThrowError)
    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow(throwError)
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(mockThrowError)
    const result = sut.add(mockAddAccountParams())
    await expect(result).rejects.toThrow(throwError)
  })

  it('should call call repository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const accountData = mockAddAccountParams()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(accountData)
    expect(addSpy).toBeCalledWith({
      ...accountData,
      password: 'hashed_value'
    })
  })

  it('should return an account on sucess', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()
    const account = await sut.add(accountData)
    expect(account).toEqual({
      ...accountData,
      id: 'any_id',
      password: 'hashed_password'
    })
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const fakeAccount = mockAddAccountParams()
    await sut.add(fakeAccount)
    expect(loadSpy).toHaveBeenCalledWith(fakeAccount.email)
  })

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const fakeAccount = mockAddAccountParams()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce({ id: 'any_id', ...fakeAccount })
    const response = await sut.add(fakeAccount)
    expect(response).toBeNull()
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(mockThrowError)
    const result = sut.add(mockAddAccountParams())
    await expect(result).rejects.toThrow(throwError)
  })
})
