import { InvalidParamError, MissingParamError } from '../erros'
import { badRequest, serverError } from '../helpers/http-helper'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'

export class SingUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const payload = httpRequest.body

      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!payload[field]) { return badRequest(new MissingParamError(field)) }
      }

      if (payload.password !== payload.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(payload.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 202
      }
    } catch (error) {
      return serverError()
    }
  }
}
