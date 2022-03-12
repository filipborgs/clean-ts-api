import { SingUpController } from './singup'

describe('SingUp Controller', () => {
  test('should return if no name is provided', () => {
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        email: '',
        password: '',
        passwordConfirmation: ''
      }
    }
    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error(''))
  })
})
