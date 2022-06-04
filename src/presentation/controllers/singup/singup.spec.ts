import { SingUpController } from './singup'
import { ServerError } from '../../erros'
import { AddAccount, AddAccountModel, AccountModel, HttpRequest, HttpResponse } from './singup-protocols'
import { Validation } from '../../protocols/validation'
import { badRequest } from '../../helpers/http/http-helper'

describe('SingUp Controller', () => {
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
  }

  const makeSut = (): sutTypes => {
    const addAccountStub = new AddAccountStub()
    const validationStub = new ValidationStub()
    const sut = new SingUpController(addAccountStub, validationStub)
    return {
      sut, addAccountStub, validationStub
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
