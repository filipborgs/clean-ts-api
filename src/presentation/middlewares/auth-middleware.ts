import { LoadAccountByToken } from '../../domain/use-cases'
import { AccessDeniedError } from '../erros'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = httpRequest.headers?.['x-access-token']
      if (token) {
        const account = await this.loadAccountByToken.loadByToken(token, this.role)
        if (account) {
          return ok(account)
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
