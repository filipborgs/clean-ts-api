import { AlreadyInUseError } from '../../../erros'
import { badRequest, created, forbidden, serverError } from '../../../helpers/http/http-helper'
import { Authentication } from '../login/login-controller-protocols'
import { AddAccount, HttpRequest, HttpResponse, Controller, Validation } from './singup-controller-protocols'

export class SingUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation?.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })
      if (!account) return forbidden(new AlreadyInUseError('email'))

      const token = await this.authentication.login({ email, password })

      return created({ account, token })
    } catch (error) {
      return serverError(error)
    }
  }
}
