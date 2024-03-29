import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { mockAuthentication, mockValidation } from '@/presentation/test'
import { LoginController } from './login-controller'
import { Authentication, HttpRequest, Validation } from './login-controller-protocols'
interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const mockFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = mockFakeRequest()
    const loginSpy = jest.spyOn(authenticationStub, 'login')
    await sut.handle(request)
    const { email, password } = request.body
    expect(loginSpy).toBeCalledWith({ email, password })
  })

  test('Should return 401 if an invlid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = mockFakeRequest()
    jest.spyOn(authenticationStub, 'login').mockResolvedValueOnce(null)
    const response = await sut.handle(request)
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'login').mockImplementationOnce(mockThrowError)
    const httpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(throwError))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const request = mockFakeRequest()
    const response = await sut.handle(request)
    expect(response).toEqual(ok({ token: 'valid_token' }))
  })

  test('should call Validation with correct value', async () => {
    const httpRequest = mockFakeRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should returns 400 if Validation returns an error', async () => {
    const httpRequest = mockFakeRequest()
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
