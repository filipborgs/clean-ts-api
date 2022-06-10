import { Authentication, HttpRequest, Validation, AuthenticationModel } from './login-controller-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { LoginController } from './login-controller'

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async login (authentication: AuthenticationModel): Promise<string | null> {
      return 'valid_token'
    }
  }

  const authenticationStub = new AuthenticationStub()
  return authenticationStub
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = makeValidationStub()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = makeFakeRequest()
    const loginSpy = jest.spyOn(authenticationStub, 'login')
    await sut.handle(request)
    const { email, password } = request.body
    expect(loginSpy).toBeCalledWith({ email, password })
  })

  test('Should return 401 if an invlid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = makeFakeRequest()
    jest.spyOn(authenticationStub, 'login').mockResolvedValueOnce(null)
    const response = await sut.handle(request)
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'login').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok({ token: 'valid_token' }))
  })

  test('should call Validation with correct value', async () => {
    const httpRequest = makeFakeRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should returns 400 if Validation returns an error', async () => {
    const httpRequest = makeFakeRequest()
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
