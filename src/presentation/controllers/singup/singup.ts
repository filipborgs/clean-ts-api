import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest, created, serverError } from '../../helpers/http-helper'
import { Validation } from '../../helpers/validators/validation'
import { AddAccount, HttpRequest, HttpResponse, Controller, EmailValidator, AccountModel } from './singup-protocols'

export class SingUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation?.validate(httpRequest.body)
      const { name, email, password, passwordConfirmation } = httpRequest.body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) { return badRequest(new MissingParamError(field)) }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      const account: AccountModel = await this.addAccount.add({ name, email, password })

      return created(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
