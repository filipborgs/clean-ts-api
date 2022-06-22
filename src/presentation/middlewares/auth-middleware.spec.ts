import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../erros'
describe('Auth Middleware', () => {
  test('Should returns 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
