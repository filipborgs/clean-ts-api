import { Authentication, Controller, HttpRequest, HttpResponse } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body

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
