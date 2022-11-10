import { mockThrowError, throwError } from '@/domain/test/test-helpers'
import { AlreadyInUseError, ServerError } from '@/presentation/erros'
import { badRequest, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'
import { SingUpController } from './singup-controller'
import { AccountModel, AddAccount, AddAccountParams, Authentication, HttpRequest, HttpResponse } from './singup-controller-protocols'

describe('SingUp Controller', () => {
  interface sutTypes {
    sut: SingUpController
    addAccountStub: AddAccount
    validationStub: Validation
    authenticationStub: Authentication
  }

  const makeSut = (): sutTypes => {
    const addAccountStub = mockAddAccount()
    const validationStub = mockValidation()
    const authenticationStub = mockAuthentication()
    const sut = new SingUpController(addAccountStub, validationStub, authenticationStub)
    return {
      sut, addAccountStub, validationStub, authenticationStub
    }
  }

  const mockHttpRequest = (): HttpRequest => ({
    body: {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  })

  test('should return 500 if AddAccount throws', async () => {
    const httpRequest = mockHttpRequest()
    const { sut, addAccountStub } = makeSut()
    const throwsFunction = async (account: AddAccountParams): Promise<AccountModel> => { throw new Error() }
    jest.spyOn(addAccountStub, 'add').mockImplementation(throwsFunction)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
  })

  test('should call AddAccount with correct values', async () => {
    const httpRequest = mockHttpRequest()
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(httpRequest)

    const { name, email, password } = httpRequest.body

    expect(addAccountSpy).toBeCalledWith({ name, email, password })
  })

  test('should return 201 if request has sucess', async () => {
    const httpRequest = mockHttpRequest()
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
    const httpRequest = mockHttpRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should returns 403 if AddAccount returns null', async () => {
    const httpRequest = mockHttpRequest()
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null as any)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AlreadyInUseError('email')))
  })

  test('should returns 400 if Validation returns an error', async () => {
    const httpRequest = mockHttpRequest()
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = mockHttpRequest()
    const loginSpy = jest.spyOn(authenticationStub, 'login')
    await sut.handle(request)
    const { email, password } = request.body
    expect(loginSpy).toBeCalledWith({ email, password })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'login').mockImplementationOnce(mockThrowError)
    const httpResponse = await sut.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(throwError))
  })
})
