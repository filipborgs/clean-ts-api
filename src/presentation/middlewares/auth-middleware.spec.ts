import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../erros'
import { LoadAccountByToken } from '../../domain/use-cases'
import { AccountModel } from '../../domain/models'
import { HttpRequest } from '../protocols'

describe('Auth Middleware', () => {
  interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByToken
  }

  const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async loadByToken (email: string): Promise<AccountModel | null> {
        return makeFakeAccount()
      }
    }

    return new LoadAccountByTokenStub()
  }

  const makeSut = (): SutTypes => {
    const loadAccountByTokenStub = makeLoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub, 'any_role')
    return {
      sut,
      loadAccountByTokenStub
    }
  }

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'hashed_password'
  })

  const makeFakeHttpRequest = (): HttpRequest => ({
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
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(loadSpy).toBeCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should returns 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockResolvedValueOnce(null)
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should returns 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'loadByToken').mockImplementationOnce(() => { throw new Error('any_error') })
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(serverError(new Error('any_error')))
  })

  test('Should returns 200 succeeds', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeFakeHttpRequest())
    expect(response).toEqual(ok(makeFakeAccount()))
  })
})
