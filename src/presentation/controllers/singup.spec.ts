import { SingUpController } from './singup'
import faker from '@faker-js/faker'

describe('SingUp Controller', () => {
  let httpRequest: any
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

  test('should return if no name is provided', () => {
    delete httpRequest.body.name
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing required param: name'))
  })
})
