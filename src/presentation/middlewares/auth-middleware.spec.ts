import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/erros'
import { LoadAccountByToken, HttpRequest } from './auth-middleware-protocols'
import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { mockAccountModel } from '@/domain/test'
import { mockLoadAccountByToken } from '@/presentation/test'

describe('Auth Middleware', () => {
  interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
  }

  const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = mockLoadAccountByToken()
    const sut = new AuthMiddleware(loadAccountByTokenStub, 'any_role')
    return {
      sut,
      loadAccountByTokenStub
    }
  }

  const mockFakeHttpRequest = (): HttpRequest => ({
    headers: {
      'x-access-token': 'any_token'
    }
  })

  test('Should returns 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpRequest = mockFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toBeCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should returns 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValueOnce(null)
    const response = await sut.handle(mockFakeHttpRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should returns 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockImplementationOnce(mockThrowError)
    const response = await sut.handle(mockFakeHttpRequest())
    expect(response).toEqual(serverError(throwError))
  })

  test('Should returns 200 succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockFakeHttpRequest())
    expect(response).toEqual(ok(mockAccountModel()))
  })
})
