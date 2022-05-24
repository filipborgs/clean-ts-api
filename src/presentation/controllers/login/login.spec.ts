import { Authentication } from '../../../domain/use-cases/authentication'
import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest, serverError } from '../../helpers/http-helper'
import { EmailValidator, HttpRequest } from '../../protocols'
import { LoginController } from './login'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

const makeEmailValidatorStub = (): EmailValidatorStub => {
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

class AuthenticationStub implements Authentication {
  async login (email: string, password: string): Promise<string | null> {
    return 'valid_token'
  }
}

const makeAuthenticationStub = (): AuthenticationStub => {
  const authenticationStub = new AuthenticationStub()
  return authenticationStub
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidatorStub
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should returns 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should returns 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email)
  })

  test('Should returns 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const request = makeFakeRequest()
    const loginSpy = jest.spyOn(authenticationStub, 'login')
    await sut.handle(request)
    expect(loginSpy).toBeCalledWith(request.body.email, request.body.password)
  })
})
