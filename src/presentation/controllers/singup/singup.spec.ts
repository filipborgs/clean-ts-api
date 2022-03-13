import { SingUpController } from './singup'
import faker from '@faker-js/faker'
import { ServerError, InvalidParamError, MissingParamError } from '../../erros'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, HttpResponse, EmailValidator } from './singup-protocols'

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

  test('should return 400 if no name is provided', async () => {
    delete httpRequest.body.name
    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', async () => {
    delete httpRequest.body.email
    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', async () => {
    delete httpRequest.body.password
    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    delete httpRequest.body.passwordConfirmation
    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if no an email is provided', async () => {
    httpRequest.body.email = 'invalidEmail'

    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)

    const httpResponse: HttpResponse = await sut.handle(httpRequest)

    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call emailValidator with correct email', async () => {
    const emailValidatorSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(emailValidatorSpy).toBeCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const throwFunction = (email: string): boolean => { throw new Error() }
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(throwFunction)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if AddAccount throws', async () => {
    const throwsFunction = async (account: AddAccountModel): Promise<AccountModel> => { throw new Error() }
    jest.spyOn(addAccountStub, 'add').mockImplementation(throwsFunction)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 400 if password and passwordConfirmation is different', async () => {
    httpRequest.body.password = 'anyPassword'
    httpRequest.body.passwordConfirmation = 'diferentPassword'

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should call AddAccount with correct values', async () => {
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(httpRequest)

    const payload = {
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }

    expect(addAccountSpy).toBeCalledWith(payload)
  })

  test('should return 201 if request has sucess', async () => {
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    const account = {
      id: 'valid_id',
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    }
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(account)
  })
})
