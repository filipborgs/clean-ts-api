import { SingUpController } from './singup'
import faker from '@faker-js/faker'
import { HttpRequest, HttpResponse } from '../protocols/http'

describe('SingUp Controller', () => {
  let httpRequest: HttpRequest
  let sut: SingUpController

  beforeEach(() => {
    sut = new SingUpController()
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

  test('should return 400 if no name is provided', () => {
    delete httpRequest.body.name
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing required param: name'))
  })

  test('should return 400 if no email is provided', () => {
    delete httpRequest.body.email
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing required param: email'))
  })

  test('should return 202 if request has no error', () => {
    const httpResponse: HttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(202)
  })
})
