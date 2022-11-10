import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'
import { mockAccountModel } from '@/domain/test'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

describe('DbLoadAccountByToken', () => {
  interface SutTypes {
    sut: DbLoadAccountByToken
    decrypterStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeSut = (): SutTypes => {
    const decrypterStub = mockDecrypter()
    const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
    const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
    return {
      sut,
      decrypterStub,
      loadAccountByTokenRepositoryStub
    }
  }

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
    expect(response).toEqual(mockAccountModel())
  })

  test('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(mockThrowError)
    const result = sut.loadByToken('any_token', 'any_role')
    await expect(result).rejects.toThrow(throwError)
  })

  test('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(mockThrowError)
    const result = sut.loadByToken('any_token', 'any_role')
    await expect(result).rejects.toThrow(throwError)
  })
})
