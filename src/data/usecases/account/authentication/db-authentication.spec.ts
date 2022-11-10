import { mockHashCompare, mockLoadAccountByEmailRepository, mockTokenGenerator, mockUpdateAccessTokenRepository } from '@/data/test'
import { mockAuthenticationParams } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbAuthentication } from './db-authentication'
import {
  HashCompare, LoadAccountByEmailRepository, TokenGenerator, UpdateAccessTokenRepository
} from './db-authentication-protocols'

describe('DbAuthentication UseCase', () => {
  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashCompare
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
    const hashComparerStub = mockHashCompare()
    const tokenGeneratorStub = mockTokenGenerator()
    const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
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

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.login(mockAuthenticationParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(mockThrowError)
    const result = sut.login(mockAuthenticationParams())
    await expect(result).rejects.toThrow(throwError)
  })

  test('should return null if LoadAccountByEmailRepository retuns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const token = await sut.login(mockAuthenticationParams())
    expect(token).toBeNull()
  })

  test('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    const authAccount = mockAuthenticationParams()
    await sut.login(authAccount)
    expect(compareSpy).toBeCalledWith(authAccount.password, 'hashed_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(mockThrowError)
    const result = sut.login(mockAuthenticationParams())
    await expect(result).rejects.toThrow(throwError)
  })

  test('should return null if HashComparer retuns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const token = await sut.login(mockAuthenticationParams())
    expect(token).toBeNull()
  })

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    const authAccount = mockAuthenticationParams()
    await sut.login(authAccount)
    expect(tokenGeneratorSpy).toBeCalledWith('any_id')
  })

  test('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(mockThrowError)
    const result = sut.login(mockAuthenticationParams())
    await expect(result).rejects.toThrow(throwError)
  })

  test('should return a token if HashComparer retuns a token', async () => {
    const { sut } = makeSut()
    const token = await sut.login(mockAuthenticationParams())
    expect(token).toEqual('valid_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const authAccount = mockAuthenticationParams()
    await sut.login(authAccount)
    expect(updateSpy).toBeCalledWith('any_id', 'valid_token')
  })

  test('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(mockThrowError)
    const result = sut.login(mockAuthenticationParams())
    await expect(result).rejects.toThrow(throwError)
  })
})
