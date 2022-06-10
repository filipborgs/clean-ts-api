import { SingUpController } from './singup-controller'
import { AlreadyInUseError, ServerError } from '../../erros'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, HttpResponse } from './singup-controller-protocols'
import { Validation } from '../../protocols/validation'
import { badRequest, forbidden, serverError } from '../../helpers/http/http-helper'
import { Authentication, AuthenticationModel } from '../login/login-controller-protocols'

describe('SingUp Controller', () => {
  const makeAuthenticationStub = (): Authentication => {
    class AuthenticationStub implements Authentication {
      async login (authentication: AuthenticationModel): Promise<string | null> {
        return 'valid_token'
      }
    }

    const authenticationStub = new AuthenticationStub()
    return authenticationStub
  }

  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: 'valid_id',
        name: account.name,
        email: account.email,
        password: account.password
      }
      return await Promise.resolve(fakeAccount)
    }
  }

  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  interface sutTypes {
    sut: SingUpController
    addAccountStub: AddAccountStub
    validationStub: Validation
    authenticationStub: Authentication
  }

  const makeSut = (): sutTypes => {
    const addAccountStub = new AddAccountStub()
    const validationStub = new ValidationStub()
    const authenticationStub = makeAuthenticationStub()
    const sut = new SingUpController(addAccountStub, validationStub, authenticationStub)
    return {
      sut, addAccountStub, validationStub, authenticationStub
    }
  }

  const makeHttpRequest = (): HttpRequest => ({
    body: {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  })

  test('should return 500 if AddAccount throws', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, addAccountStub } = makeSut()
    const throwsFunction = async (account: AddAccountModel): Promise<AccountModel> => { throw new Error() }
    jest.spyOn(addAccountStub, 'add').mockImplementation(throwsFunction)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('should call AddAccount with correct values', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(httpRequest)

    const { name, email, password } = httpRequest.body

    expect(addAccountSpy).toBeCalledWith({ name, email, password })
  })

  test('should return 201 if request has sucess', async () => {
    const httpRequest = makeHttpRequest()
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    const { name, email, password } = httpRequest.body
    const account = {
      id: 'valid_id',
      name,
      email,
      password
    }
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual({ account, token: 'valid_token' })
  })

  test('should call Validation with correct value', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should returns 403 if AddAccount returns null', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null as any)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AlreadyInUseError('email')))
  })

  test('should returns 400 if Validation returns an error', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = makeHttpRequest()
    const loginSpy = jest.spyOn(authenticationStub, 'login')
    await sut.handle(request)
    const { email, password } = request.body
    expect(loginSpy).toBeCalledWith({ email, password })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'login').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
