import { Authentication, Controller, EmailValidator, HttpRequest, HttpResponse } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../erros'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      const token = await this.authentication.login(email, password)
      if (!token) return unauthorized()

      return ok({
        token
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
