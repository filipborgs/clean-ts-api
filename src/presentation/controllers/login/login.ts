import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
    if (!password) {
      return badRequest(new MissingParamError('password'))
    }
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'))
    }
    return null as any
  }
}
