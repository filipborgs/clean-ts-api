import { ok } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return ok('any_body')
      }
    }
    const controllerStub = new ControllerStub()
    const controllerStubSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest: HttpRequest = {
      body: 'valid_body'
    }
    await sut.handle(httpRequest)
    expect(controllerStubSpy).toBeCalledWith(httpRequest)
  })
})
