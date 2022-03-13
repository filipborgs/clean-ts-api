import { SingUpController } from './singup'
import faker from '@faker-js/faker'
import { HttpRequest, HttpResponse, EmailValidator } from '../protocols'
import { ServerError, InvalidParamError, MissingParamError } from '../erros'
import { AddAccount, AddAccountModel } from '../../domain/use-cases'
import { AccountModel } from '../../domain/models'

describe('SingUp Controller', () => {
  let httpRequest: HttpRequest
  let sut: SingUpController
  let emailValidatorStub: EmailValidator
  let addAccountStub: AddAccount

  beforeEach(() => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        return true
      }
    }
    class AddAccount implements AddAccount {
      add (account: AddAccountModel): AccountModel {
        return {
          id: 'valid_id',
          name: account.name,
          email: account.email,
          password: account.password
        }
      }
    }

    emailValidatorStub = new EmailValidatorStub()
    addAccountStub = new AddAccount()
    sut = new SingUpController(emailValidatorStub, addAccountStub)

    const password = faker.internet.password()
    httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password
      }
    }
  })

  test('should return 400 if no name is provided', () => {
    delete httpRequest.body.name
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    delete httpRequest.body.email
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    delete httpRequest.body.password
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    delete httpRequest.body.passwordConfirmation
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if no an email is provided', () => {
    httpRequest.body.email = 'invalidEmail'

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call emailValidator with correct email', () => {
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.handle(httpRequest)
    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', () => {
    const throwFunction = (email: string): boolean => { throw new Error() }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(throwFunction)
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 400 if password and passwordConfirmation is different', () => {
    httpRequest.body.password = 'anyPassword'
    httpRequest.body.passwordConfirmation = 'diferentPassword'

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should call AddAccount with correct values', () => {
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    sut.handle(httpRequest)

    const payload = {
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }

    expect(addAccountSpy).toBeCalledWith(payload)
  })

  test('should return 202 if request has no error', () => {
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(202)
  })
})
