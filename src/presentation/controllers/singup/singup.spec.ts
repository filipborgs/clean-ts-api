import { SingUpController } from './singup'
import { ServerError, InvalidParamError, MissingParamError } from '../../erros'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, HttpResponse, EmailValidator } from './singup-protocols'
import { Validation } from '../../helpers/validators/validation'
import { badRequest } from '../../helpers/http-helper'

describe('SingUp Controller', () => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
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
    validate (input: any): Error | null {
      return null
    }
  }

  interface sutTypes {
    sut: SingUpController
    emailValidatorStub: EmailValidatorStub
    addAccountStub: AddAccountStub
    validationStub: Validation
  }

  const makeSut = (): sutTypes => {
    const emailValidatorStub = new EmailValidatorStub()
    const addAccountStub = new AddAccountStub()
    const validationStub = new ValidationStub()
    const sut = new SingUpController(emailValidatorStub, addAccountStub, validationStub)
    return {
      sut, emailValidatorStub, addAccountStub, validationStub
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

  test('should return 400 if no name is provided', async () => {
    const httpRequest = makeHttpRequest()
    httpRequest.body.name = null
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', async () => {
    const httpRequest = makeHttpRequest()
    httpRequest.body.email = null
    const { sut } = makeSut()

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', async () => {
    const httpRequest = makeHttpRequest()
    httpRequest.body.password = null
    const { sut } = makeSut()

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    const httpRequest = makeHttpRequest()
    httpRequest.body.passwordConfirmation = null
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if no an email is provided', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, emailValidatorStub } = makeSut()
    httpRequest.body.email = 'invalid_email'

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call emailValidator with correct email', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, emailValidatorStub } = makeSut()
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const throwFunction = (email: string): boolean => { throw new Error() }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(throwFunction)
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(''))
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

  test('should return 400 if password and passwordConfirmation is different', async () => {
    const httpRequest = makeHttpRequest()
    httpRequest.body.password = 'anyPassword'
    httpRequest.body.passwordConfirmation = 'diferentPassword'
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
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
    expect(httpResponse.body).toEqual(account)
  })

  test('should call Validation with correct value', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  test('should returns 400 if Validation returns an error', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})
